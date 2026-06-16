import { FastifyInstance } from 'fastify'
import { verifyToken } from '../../shared/middleware/auth.middleware'
import {
  requireRecruiter,
  requireAnyRole,
} from '../../shared/middleware/rbac.middleware'
import {
  ApplicationQuerySchema,
  CreateApplicationSchema,
  UpdateApplicationStatusSchema,
  CreateInterviewRoundSchema,
  UpdateInterviewRoundSchema,
} from './application.schema'
import {
  listApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  addInterviewRound,
  updateInterviewRound,
  recalculateMatchScore,
} from './application.service'

export async function applicationRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyToken)

  // All authenticated users can read
  app.get('/', { preHandler: requireAnyRole }, async (request) => {
    const query = ApplicationQuerySchema.parse(request.query)
    const result = await listApplications(query)
    return { success: true, ...result }
  })

  app.get('/:id', { preHandler: requireAnyRole }, async (request) => {
    const { id } = request.params as { id: string }
    const data = await getApplicationById(id)
    return { success: true, data }
  })

  // Recruiter and admin can create and update
  app.post('/', { preHandler: requireRecruiter }, async (request, reply) => {
    const body = CreateApplicationSchema.parse(request.body)
    const user = request.user as { id: string }
    const data = await createApplication(body, user.id)
    return reply.status(201).send({ success: true, data })
  })

  app.patch('/:id/status', { preHandler: requireRecruiter }, async (request) => {
    const { id } = request.params as { id: string }
    const body = UpdateApplicationStatusSchema.parse(request.body)
    const data = await updateApplicationStatus(id, body)
    return { success: true, data }
  })

  app.post('/:id/recalculate-score', { preHandler: requireRecruiter }, async (request) => {
    const { id } = request.params as { id: string }
    const data = await recalculateMatchScore(id)
    return { success: true, data }
  })

  // ─── Interview Rounds ─────────────────────────────────
  app.post('/:id/interviews', { preHandler: requireRecruiter }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = CreateInterviewRoundSchema.parse(request.body)
    const data = await addInterviewRound(id, body)
    return reply.status(201).send({ success: true, data })
  })

  app.patch('/:id/interviews/:roundId', { preHandler: requireRecruiter }, async (request) => {
    const { id, roundId } = request.params as { id: string; roundId: string }
    const body = UpdateInterviewRoundSchema.parse(request.body)
    const data = await updateInterviewRound(id, roundId, body)
    return { success: true, data }
  })
}