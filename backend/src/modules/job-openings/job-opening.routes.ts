import { FastifyInstance } from 'fastify'
import { verifyToken } from '../../shared/middleware/auth.middleware'
import {
  requireAdmin,
  requireRecruiterOrAccountManager,
  requireAnyRole,
} from '../../shared/middleware/rbac.middleware'
import {
  JobOpeningQuerySchema,
  CreateJobOpeningSchema,
  UpdateJobOpeningSchema,
   SuggestedCandidatesQuerySchema,
} from './job-opening.schema'
import {
  listJobOpenings,
  getJobOpeningById,
  createJobOpening,
  updateJobOpening,
  deleteJobOpening,
  getSuggestedCandidates,
} from './job-opening.service'

export async function jobOpeningRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyToken)

  // All authenticated users can read
  app.get('/', { preHandler: requireAnyRole }, async (request) => {
    const query = JobOpeningQuerySchema.parse(request.query)
    const result = await listJobOpenings(query)
    return { success: true, ...result }
  })

  app.get('/:id', { preHandler: requireAnyRole }, async (request) => {
    const { id } = request.params as { id: string }
    const data = await getJobOpeningById(id)
    return { success: true, data }
  })

  app.get('/:id/suggested-candidates', { preHandler: requireAnyRole }, async (request) => {
    const { id } = request.params as { id: string }
    const query = SuggestedCandidatesQuerySchema.parse(request.query)
    const result = await getSuggestedCandidates(id, query)
    return { success: true, ...result }
  })

  // Recruiter, account_manager, admin can create and update
  app.post('/', { preHandler: requireRecruiterOrAccountManager }, async (request, reply) => {
    const body = CreateJobOpeningSchema.parse(request.body)
    const user = request.user as { id: string }
    const data = await createJobOpening(body, user.id)
    return reply.status(201).send({ success: true, data })
  })

  app.put('/:id', { preHandler: requireRecruiterOrAccountManager }, async (request) => {
    const { id } = request.params as { id: string }
    const body = UpdateJobOpeningSchema.parse(request.body)
    const data = await updateJobOpening(id, body)
    return { success: true, data }
  })

  // Only admin can delete
  app.delete('/:id', { preHandler: requireAdmin }, async (request) => {
    const { id } = request.params as { id: string }
    await deleteJobOpening(id)
    return { success: true, message: 'Job opening deleted' }
  })
}