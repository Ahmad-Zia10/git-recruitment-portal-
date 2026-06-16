import { getApp, getAdminToken } from './helpers'
import { prisma } from '../src/config/prisma'

describe('Application Status Machine', () => {
  let app: Awaited<ReturnType<typeof getApp>>
  let token: string
  let interviewingApplicationId: string

  beforeAll(async () => {
    app = await getApp()
    token = await getAdminToken(app)

    const candidate = await prisma.candidates.findFirst()
    const opening = await prisma.job_openings.findFirst({
      where: {
        applications: {
          none: { candidate_id: candidate!.id }
        }
      }
    })

    if (!candidate || !opening) throw new Error('Seed data missing')

    const application = await prisma.applications.create({
      data: {
        job_opening_id: opening.id,
        candidate_id: candidate.id,
        status: 'interviewing',
        created_by: candidate.created_by,
        match_score: 50,
      },
    })

    interviewingApplicationId = application.id
  })

  afterAll(async () => {
    if (interviewingApplicationId) {
      await prisma.applications.delete({
        where: { id: interviewingApplicationId },
      })
    }
    await app.close()
  })

  it('rejects invalid status transition with 400', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/api/v1/applications/${interviewingApplicationId}/status`,
      headers: { authorization: `Bearer ${token}` },
      payload: { status: 'placed' },
    })

    expect(response.statusCode).toBe(400)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(false)
    expect(body.code).toBe('VALIDATION_ERROR')
  })

  it('allows valid status transition', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/api/v1/applications/${interviewingApplicationId}/status`,
      headers: { authorization: `Bearer ${token}` },
      payload: { status: 'offered' },
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.data.status).toBe('offered')
  })
})