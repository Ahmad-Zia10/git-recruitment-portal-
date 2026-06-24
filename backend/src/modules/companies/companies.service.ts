import { prisma } from '../../config/prisma'
import { NotFoundError, ConflictError } from '../../shared/errors'
import { getPagination, getPaginationMeta } from '../../shared/utils/pagination'
import { CreateCompanyInput, UpdateCompanyInput, CompanyQuery } from './companies.schema'

export async function listCompanies(query: CompanyQuery) {
  const { skip, take, page, limit } = getPagination(query)

  const where = {
    ...(query.status && { status: query.status }),
    ...(query.search && {
      name: { contains: query.search, mode: 'insensitive' as const },
    }),
  }

  const [data, total] = await Promise.all([
    prisma.companies.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: 'desc' },
      include: {
        account_manager: {
          select: { id: true, full_name: true, email: true },
        },
      },
    }),
    prisma.companies.count({ where }),
  ])

  return {
    data,
    meta: getPaginationMeta(total, page, limit),
  }
}

export async function getCompanyById(id: string) {
  const company = await prisma.companies.findUnique({
    where: { id },
    include: {
      account_manager: {
        select: { id: true, full_name: true, email: true },
      },
    },
  })

  if (!company) throw new NotFoundError('Company not found')
  return company
}

export async function createCompany(data: CreateCompanyInput) {
  return prisma.companies.create({ data })
}

export async function updateCompany(id: string, data: UpdateCompanyInput) {
  await getCompanyById(id)
  return prisma.companies.update({ where: { id }, data })
}

export async function deleteCompany(id: string) {
  await getCompanyById(id)
  const linkedJobs = await prisma.job_openings.count({ where: { company_id: id } })
  if (linkedJobs > 0) {
    throw new ConflictError('Cannot delete a client that has linked requirements')
  }
  return prisma.companies.delete({ where: { id } })
}