import { getApp, getAdminToken } from './helpers'
import { prisma } from '../src/config/prisma'

describe('Match Score', () => {
  let app: Awaited<ReturnType<typeof getApp>>
  let token: string
  let createdApplicationId: string

  beforeAll(async () => {
    app = await getApp()
    token = await getAdminToken(app)
  })

  afterAll(async () => {
    if (createdApplicationId) {
      await prisma.applications.delete({ where: { id: createdApplicationId } })
    }
    await app.close()
  })

  it('returns a match score between 0 and 100 on application create', async () => {
    const candidate = await prisma.candidates.findFirst()
    const opening = await prisma.job_openings.findFirst()

    if (!candidate || !opening) throw new Error('Seed data missing')

    const existing = await prisma.applications.findUnique({
      where: {
        job_opening_id_candidate_id: {
          job_opening_id: opening.id,
          candidate_id: candidate.id,
        },
      },
    })

    if (existing) {
      return
    }

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/applications',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        job_opening_id: opening.id,
        candidate_id: candidate.id,
      },
    })

    expect(response.statusCode).toBe(201)
    const body = JSON.parse(response.body)
    const score = Number(body.data.match_score)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
    createdApplicationId = body.data.id
  })
})