import { prisma } from '../../config/prisma'
import { NotFoundError, ConflictError } from '../../shared/errors'
import { getPagination, getPaginationMeta } from '../../shared/utils/pagination'
import {
  CreateApplicationInput,
  UpdateApplicationStatusInput,
  ApplicationQuery,
  CreateInterviewRoundInput,
  UpdateInterviewRoundInput,
} from './application.schema'

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
      orderBy: { applied_at: 'desc' },
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

  return prisma.applications.create({
    data: {
      ...data,
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
  await getApplicationById(id)

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

export async function addInterviewRound(
  applicationId: string,
  data: CreateInterviewRoundInput
) {
  await getApplicationById(applicationId)

  return prisma.interview_rounds.create({
    data: {
      ...data,
      application_id: applicationId,
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
    },
  })
}

export async function updateInterviewRound(
  applicationId: string,
  roundId: string,
  data: UpdateInterviewRoundInput
) {
  await getApplicationById(applicationId)

  return prisma.interview_rounds.update({
    where: { id: roundId },
    data: {
      ...data,
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
    },
  })
}