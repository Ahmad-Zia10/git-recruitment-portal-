import { prisma } from '../../config/prisma'
import { NotFoundError } from '../../shared/errors'
import { getPagination, getPaginationMeta } from '../../shared/utils/pagination'
import {
  CreateJobOpeningInput,
  UpdateJobOpeningInput,
  JobOpeningQuery,
} from './job-opening.schema'
import { getSorting } from '../../shared/utils/sorting'

const jobOpeningInclude = {
  company: {
    select: { id: true, name: true, industry: true, city: true },
  },
  role: {
    select: { id: true, title: true, category: true },
  },
  creator: {
    select: { id: true, full_name: true },
  },
}

export async function listJobOpenings(query: JobOpeningQuery) {
  const { skip, take, page, limit } = getPagination(query)
  const orderBy = getSorting(
    query.sortBy,
    query.sortOrder,
    ['created_at', 'priority', 'expected_start_date', 'status'],
    'created_at'
  )

  const where = {
    ...(query.status && { status: query.status }),
    ...(query.hiring_type && { hiring_type: query.hiring_type }),
    ...(query.work_mode && { work_mode: query.work_mode }),
    ...(query.priority && { priority: query.priority }),
    ...(query.company_id && { company_id: query.company_id }),
    ...(query.role_id && { role_id: query.role_id }),
    ...(query.search && {
      OR: [
        { location: { contains: query.search, mode: 'insensitive' as const } },
        { job_description: { contains: query.search, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [data, total] = await Promise.all([
    prisma.job_openings.findMany({
      where,
      skip,
      take,
      orderBy,
      include: jobOpeningInclude,
    }),
    prisma.job_openings.count({ where }),
  ])

  return {
    data,
    meta: getPaginationMeta(total, page, limit),
  }
}

export async function getJobOpeningById(id: string) {
  const opening = await prisma.job_openings.findUnique({
    where: { id },
    include: jobOpeningInclude,
  })

  if (!opening) throw new NotFoundError('Job opening not found')
  return opening
}

export async function createJobOpening(
  data: CreateJobOpeningInput,
  createdBy: string
) {
  const company = await prisma.companies.findUnique({
    where: { id: data.company_id },
  })
  if (!company) throw new NotFoundError('Company not found')

  const role = await prisma.roles.findUnique({
    where: { id: data.role_id },
  })
  if (!role) throw new NotFoundError('Role not found')

  return prisma.job_openings.create({
    data: {
      ...data,
      expected_start_date: data.expected_start_date
        ? new Date(data.expected_start_date)
        : undefined,
      closing_date: data.closing_date
        ? new Date(data.closing_date)
        : undefined,
      created_by: createdBy,
    },
    include: jobOpeningInclude,
  })
}

export async function updateJobOpening(
  id: string,
  data: UpdateJobOpeningInput
) {
  await getJobOpeningById(id)
  return prisma.job_openings.update({
    where: { id },
    data: {
      ...data,
      expected_start_date: data.expected_start_date
        ? new Date(data.expected_start_date)
        : undefined,
      closing_date: data.closing_date
        ? new Date(data.closing_date)
        : undefined,
    },
    include: jobOpeningInclude,
  })
}

export async function deleteJobOpening(id: string) {
  await getJobOpeningById(id)
  return prisma.job_openings.delete({ where: { id } })
}