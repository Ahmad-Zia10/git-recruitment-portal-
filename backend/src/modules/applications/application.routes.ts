import { FastifyInstance } from 'fastify'
import { verifyToken } from '../../shared/middleware/auth.middleware'
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
} from './application.service'

export async function applicationRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyToken)

  // ─── Applications ─────────────────────────────────────
  app.get('/', async (request) => {
    const query = ApplicationQuerySchema.parse(request.query)
    const result = await listApplications(query)
    return { success: true, ...result }
  })

  app.get('/:id', async (request) => {
    const { id } = request.params as { id: string }
    const data = await getApplicationById(id)
    return { success: true, data }
  })

  app.post('/', async (request, reply) => {
    const body = CreateApplicationSchema.parse(request.body)
    const user = request.user as { id: string }
    const data = await createApplication(body, user.id)
    return reply.status(201).send({ success: true, data })
  })

  app.patch('/:id/status', async (request) => {
    const { id } = request.params as { id: string }
    const body = UpdateApplicationStatusSchema.parse(request.body)
    const data = await updateApplicationStatus(id, body)
    return { success: true, data }
  })

  // ─── Interview Rounds ─────────────────────────────────
  app.post('/:id/interviews', async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = CreateInterviewRoundSchema.parse(request.body)
    const data = await addInterviewRound(id, body)
    return reply.status(201).send({ success: true, data })
  })

  app.patch('/:id/interviews/:roundId', async (request) => {
    const { id, roundId } = request.params as { id: string; roundId: string }
    const body = UpdateInterviewRoundSchema.parse(request.body)
    const data = await updateInterviewRound(id, roundId, body)
    return { success: true, data }
  })
}