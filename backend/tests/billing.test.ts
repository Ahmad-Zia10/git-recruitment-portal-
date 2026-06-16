import { getApp, getAdminToken } from './helpers'
import { prisma } from '../src/config/prisma'

describe('Billing Auto-Calculation', () => {
  let app: Awaited<ReturnType<typeof getApp>>
  let token: string
  let createdBillingId: string
  let createdApplicationId: string

  beforeAll(async () => {
    app = await getApp()
    token = await getAdminToken(app)

    // Create a fresh candidate and application for billing test
    const candidate = await prisma.candidates.findFirst()
    const opening = await prisma.job_openings.findFirst({
      where: {
        applications: {
          none: {
            candidate_id: candidate!.id
          }
        }
      }
    })

    if (!candidate || !opening) throw new Error('Seed data missing')

    const application = await prisma.applications.create({
      data: {
        job_opening_id: opening.id,
        candidate_id: candidate.id,
        status: 'placed',
        created_by: candidate.created_by,
        match_score: 50,
      },
    })

    createdApplicationId = application.id
  })

  afterAll(async () => {
    if (createdBillingId) {
      await prisma.billing_records.delete({ where: { id: createdBillingId } })
    }
    if (createdApplicationId) {
      await prisma.applications.delete({ where: { id: createdApplicationId } })
    }
    await app.close()
  })

  it('auto-calculates yearly amount and margin percentage', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/billing',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        application_id: createdApplicationId,
        demand_per_month: 6000,
        bill_to_customer_gbp_monthly: 7200,
        payment_status: 'pending',
      },
    })

    expect(response.statusCode).toBe(201)
    const body = JSON.parse(response.body)
    expect(Number(body.data.bill_to_customer_gbp_yearly)).toBe(86400)
    expect(Number(body.data.margin_pct)).toBeCloseTo(16.67, 1)
    createdBillingId = body.data.id
  })
})