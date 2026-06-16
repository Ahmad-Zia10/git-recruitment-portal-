import { prisma } from '../../config/prisma'
import { NotFoundError, ConflictError, ValidationError } from '../../shared/errors'
import { getPagination, getPaginationMeta } from '../../shared/utils/pagination'
import {
  CreateBillingRecordInput,
  UpdateBillingRecordInput,
  BillingQuery,
} from './billing.schema'
import { logger } from '../../config/logger'

const billingInclude = {
  application: {
    select: {
      id: true,
      status: true,
      candidate: { select: { id: true, full_name: true, email: true } },
      job_opening: {
        select: {
          id: true,
          company: { select: { id: true, name: true } },
          role: { select: { id: true, title: true } },
        },
      },
    },
  },
}

export async function listBillingRecords(query: BillingQuery) {
  const { skip, take, page, limit } = getPagination(query)

  const where = {
    ...(query.payment_status && { payment_status: query.payment_status }),
  }

  const [data, total] = await Promise.all([
    prisma.billing_records.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: 'desc' },
      include: billingInclude,
    }),
    prisma.billing_records.count({ where }),
  ])

  return {
    data,
    meta: getPaginationMeta(total, page, limit),
  }
}

export async function getBillingById(id: string) {
  const record = await prisma.billing_records.findUnique({
    where: { id },
    include: billingInclude,
  })

  if (!record) throw new NotFoundError('Billing record not found')
  return record
}

export async function createBillingRecord(data: CreateBillingRecordInput) {
  const application = await prisma.applications.findUnique({
    where: { id: data.application_id },
  })
  if (!application) throw new NotFoundError('Application not found')

  if (application.status !== 'placed') {
    throw new ValidationError('Billing records can only be created for placed applications')
  }

  const existing = await prisma.billing_records.findUnique({
    where: { application_id: data.application_id },
  })
  if (existing) throw new ConflictError('A billing record already exists for this application')

  const bill_to_customer_gbp_yearly = data.bill_to_customer_gbp_monthly * 12
  const margin_pct =
    ((data.bill_to_customer_gbp_monthly - data.demand_per_month) /
      data.bill_to_customer_gbp_monthly) *
    100

  const record = await prisma.billing_records.create({
    data: {
      ...data,
      bill_to_customer_gbp_yearly,
      margin_pct,
      billing_period_start: data.billing_period_start
        ? new Date(data.billing_period_start)
        : undefined,
      billing_period_end: data.billing_period_end
        ? new Date(data.billing_period_end)
        : undefined,
    },
    include: billingInclude,
  })

  logger.info(
    { applicationId: data.application_id, marginPct: margin_pct, yearlyAmount: bill_to_customer_gbp_yearly },
    'Billing record created with auto-calculated fields'
  )

  return record
}

export async function updateBillingRecord(
  id: string,
  data: UpdateBillingRecordInput
) {
  const existing = await getBillingById(id)

  const bill_to_customer_gbp_monthly =
    data.bill_to_customer_gbp_monthly ?? Number(existing.bill_to_customer_gbp_monthly)
  const demand_per_month =
    data.demand_per_month ?? Number(existing.demand_per_month)

  const bill_to_customer_gbp_yearly = bill_to_customer_gbp_monthly * 12
  const margin_pct =
    ((bill_to_customer_gbp_monthly - demand_per_month) /
      bill_to_customer_gbp_monthly) *
    100

  return prisma.billing_records.update({
    where: { id },
    data: {
      ...data,
      bill_to_customer_gbp_yearly,
      margin_pct,
      billing_period_start: data.billing_period_start
        ? new Date(data.billing_period_start)
        : undefined,
      billing_period_end: data.billing_period_end
        ? new Date(data.billing_period_end)
        : undefined,
    },
    include: billingInclude,
  })
}