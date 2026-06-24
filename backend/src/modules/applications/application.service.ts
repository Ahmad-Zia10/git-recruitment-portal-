import { prisma } from '../../config/prisma'
import { getPagination, getPaginationMeta } from '../../shared/utils/pagination'
import {
  CreateApplicationInput,
  UpdateApplicationStatusInput,
  ApplicationQuery,
  CreateInterviewRoundInput,
  UpdateInterviewRoundInput,
} from './application.schema'
import { validateStatusTransition, ApplicationStatus } from '../../shared/utils/status-machine'
import { computeMatchScore } from '../../shared/utils/match-score'
import { getSorting } from '../../shared/utils/sorting'
import { logger } from '../../config/logger'
import { NotFoundError, ConflictError, ValidationError } from '../../shared/errors'

const applicationInclude = {
  job_opening: {
    select: {
      id: true,
      serial_no: true,
      location: true,
      work_mode: true,
      hiring_type: true,
      company: { select: { id: true, name: true } },
      role: { select: { id: true, title: true } },
    },
  },
  candidate: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      exp_years: true,
      current_role: true,
      availability_status: true,
    },
  },
  creator: {
    select: { id: true, full_name: true },
  },
  interview_rounds: {
    orderBy: { round_number: 'asc' as const },
  },
}

export async function listApplications(query: ApplicationQuery) {
  const { skip, take, page, limit } = getPagination(query)
  const orderBy = getSorting(
    query.sortBy,
    query.sortOrder,
    ['applied_at', 'updated_at', 'match_score', 'status'],
    'applied_at'
  )

  const where = {
    ...(query.status && { status: query.status }),
    ...(query.candidate_id && { candidate_id: query.candidate_id }),
    ...(query.job_opening_id && { job_opening_id: query.job_opening_id }),
    ...(query.company_id && {
      job_opening: { company_id: query.company_id },
    }),
  }

  const [data, total] = await Promise.all([
    prisma.applications.findMany({
      where,
      skip,
      take,
      orderBy,
      include: applicationInclude,
    }),
    prisma.applications.count({ where }),
  ])

  return {
    data,
    meta: getPaginationMeta(total, page, limit),
  }
}

export async function getApplicationById(id: string) {
  const application = await prisma.applications.findUnique({
    where: { id },
    include: applicationInclude,
  })

  if (!application) throw new NotFoundError('Application not found')
  return application
}

export async function createApplication(
  data: CreateApplicationInput,
  createdBy: string
) {
  const opening = await prisma.job_openings.findUnique({
    where: { id: data.job_opening_id },
  })
  if (!opening) throw new NotFoundError('Job opening not found')

  const candidate = await prisma.candidates.findUnique({
    where: { id: data.candidate_id },
    include: { skills: true },
  })
  if (!candidate) throw new NotFoundError('Candidate not found')

  const existing = await prisma.applications.findUnique({
    where: {
      job_opening_id_candidate_id: {
        job_opening_id: data.job_opening_id,
        candidate_id: data.candidate_id,
      },
    },
  })
  if (existing) throw new ConflictError('This candidate is already applied to this opening')

  const match_score = computeMatchScore(candidate, opening)

  logger.info(
    { candidateId: data.candidate_id, jobOpeningId: data.job_opening_id, matchScore: match_score },
    'Application created with match score'
  )

  return prisma.applications.create({
    data: {
      ...data,
      match_score,
      expected_availability: data.expected_availability
        ? new Date(data.expected_availability)
        : undefined,
      created_by: createdBy,
    },
    include: applicationInclude,
  })
}

export async function updateApplicationStatus(
  id: string,
  data: UpdateApplicationStatusInput
) {
  const application = await getApplicationById(id)

  logger.info(
    { applicationId: id, from: application.status, to: data.status },
    'Application status transition requested'
  )

  validateStatusTransition(
    application.status as ApplicationStatus,
    data.status as ApplicationStatus
  )

  return prisma.applications.update({
    where: { id },
    data: {
      status: data.status,
      rejection_reason: data.rejection_reason,
      offer_date: data.offer_date ? new Date(data.offer_date) : undefined,
      placed_date: data.placed_date ? new Date(data.placed_date) : undefined,
    },
    include: applicationInclude,
  })
}

// ─── Interview Rounds ───────────────────────────────────────

// ─── Interview Rounds ───────────────────────────────────────

export async function addInterviewRound(
  applicationId: string,
  data: CreateInterviewRoundInput
) {
  const application = await getApplicationById(applicationId)

  const hasFailedRound = application.interview_rounds.some(
    (round) => round.outcome === 'failed'
  )

  if (hasFailedRound) {
    throw new ValidationError(
      'Cannot schedule a new round — a previous round has a failed outcome'
    )
  }

  const allowedRoundTypesByStatus: Record<string, string[]> = {
    shortlisted: ['screening'],
    screening: ['screening'],
    interviewing: ['technical', 'hr', 'cultural_fit', 'final'],
    offered: [],
    placed: [],
    rejected: [],
    withdrawn: [],
  }

  const allowedTypes = allowedRoundTypesByStatus[application.status] ?? []

  if (!allowedTypes.includes(data.round_type)) {
    throw new ValidationError(
      `Cannot schedule a '${data.round_type}' round while application status is '${application.status}'`
    )
  }

  const round = await prisma.interview_rounds.create({
    data: {
      ...data,
      application_id: applicationId,
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
    },
  })

  // Sync application status when a round is first scheduled
  if (application.status === 'shortlisted') {
    await prisma.applications.update({
      where: { id: applicationId },
      data: { status: 'screening' },
    })
  } else if (
    application.status === 'screening' &&
    ['technical', 'hr', 'cultural_fit', 'final'].includes(data.round_type)
  ) {
    await prisma.applications.update({
      where: { id: applicationId },
      data: { status: 'interviewing' },
    })
  }

  logger.info(
    { applicationId, roundType: data.round_type },
    'Interview round scheduled'
  )

  return round
}

export async function updateInterviewRound(
  applicationId: string,
  roundId: string,
  data: UpdateInterviewRoundInput
) {
  await getApplicationById(applicationId)

  const round = await prisma.interview_rounds.update({
    where: { id: roundId },
    data: {
      ...data,
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
    },
  })

  logger.info(
    { applicationId, roundId, outcome: data.outcome },
    'Interview round updated'
  )

  return round
}

export async function deleteInterviewRound(applicationId: string, roundId: string) {
  await getApplicationById(applicationId)

  const round = await prisma.interview_rounds.findUnique({
    where: { id: roundId },
  })

  if (!round) throw new NotFoundError('Interview round not found')

  if (round.outcome !== null) {
    throw new ValidationError(
      'Cannot delete a round that already has a recorded outcome'
    )
  }

  await prisma.interview_rounds.delete({ where: { id: roundId } })

  logger.info({ applicationId, roundId }, 'Interview round deleted')

  return { id: roundId }
}

export async function recalculateMatchScore(id: string) {
  const application = await prisma.applications.findUnique({
    where: { id },
    include: {
      candidate: { include: { skills: true } },
      job_opening: true,
    },
  })

  if (!application) throw new NotFoundError('Application not found')

  const match_score = computeMatchScore(application.candidate, application.job_opening)

  return prisma.applications.update({
    where: { id },
    data: { match_score },
    include: applicationInclude,
  })
}