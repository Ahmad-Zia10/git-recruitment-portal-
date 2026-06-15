import { FastifyInstance } from 'fastify'
import { verifyToken } from '../../shared/middleware/auth.middleware'
import {
  JobOpeningQuerySchema,
  CreateJobOpeningSchema,
  UpdateJobOpeningSchema,
} from './job-opening.schema'
import {
  listJobOpenings,
  getJobOpeningById,
  createJobOpening,
  updateJobOpening,
  deleteJobOpening,
} from './job-opening.service'

export async function jobOpeningRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyToken)

  app.get('/', async (request) => {
    const query = JobOpeningQuerySchema.parse(request.query)
    const result = await listJobOpenings(query)
    return { success: true, ...result }
  })

  app.get('/:id', async (request) => {
    const { id } = request.params as { id: string }
    const data = await getJobOpeningById(id)
    return { success: true, data }
  })

  app.post('/', async (request, reply) => {
    const body = CreateJobOpeningSchema.parse(request.body)
    const user = request.user as { id: string }
    const data = await createJobOpening(body, user.id)
    return reply.status(201).send({ success: true, data })
  })

  app.put('/:id', async (request) => {
    const { id } = request.params as { id: string }
    const body = UpdateJobOpeningSchema.parse(request.body)
    const data = await updateJobOpening(id, body)
    return { success: true, data }
  })

  app.delete('/:id', async (request) => {
    const { id } = request.params as { id: string }
    await deleteJobOpening(id)
    return { success: true, message: 'Job opening deleted' }
  })
}