import { getApp, getAdminToken } from './helpers'
import { prisma } from '../src/config/prisma'

describe('Duplicate Application Prevention', () => {
  let app: Awaited<ReturnType<typeof getApp>>
  let token: string

  beforeAll(async () => {
    app = await getApp()
    token = await getAdminToken(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('returns 409 when creating duplicate application', async () => {
    const existing = await prisma.applications.findFirst({
      select: { job_opening_id: true, candidate_id: true },
    })

    if (!existing) throw new Error('No existing application found in seed data')

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/applications',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        job_opening_id: existing.job_opening_id,
        candidate_id: existing.candidate_id,
      },
    })

    expect(response.statusCode).toBe(409)
    const body = JSON.parse(response.body)
    expect(body.code).toBe('CONFLICT')
  })
})