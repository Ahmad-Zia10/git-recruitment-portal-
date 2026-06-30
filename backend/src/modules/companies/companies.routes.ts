import { FastifyInstance } from 'fastify'
import { verifyToken } from '../../shared/middleware/auth.middleware'
import {
  requireAdmin,
  requireAccountManager,
  requireAnyRole,
} from '../../shared/middleware/rbac.middleware'
import {
  CompanyQuerySchema,
  CreateCompanySchema,
  UpdateCompanySchema,
} from './companies.schema'
import {
  listCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from './companies.service'

export async function companyRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyToken)

  // All authenticated users can read
  app.get('/', { preHandler: requireAnyRole }, async (request) => {
    const query = CompanyQuerySchema.parse(request.query)
    const result = await listCompanies(query)
    return { success: true, ...result }
  })

  app.get('/:id', { preHandler: requireAnyRole }, async (request) => {
    const { id } = request.params as { id: string }
    const data = await getCompanyById(id)
    return { success: true, data }
  })

  // Only admin and account_manager can create and update
  app.post('/', { preHandler: requireAccountManager }, async (request, reply) => {
    const body = CreateCompanySchema.parse(request.body)
    const data = await createCompany(body)
    return reply.status(201).send({ success: true, data })
  })

  app.put('/:id', { preHandler: requireAccountManager }, async (request) => {
    const { id } = request.params as { id: string }
    const body = UpdateCompanySchema.parse(request.body)
    const data = await updateCompany(id, body)
    return { success: true, data }
  })

  // Only admin can delete
  app.delete('/:id', { preHandler: requireAdmin }, async (request) => {
    const { id } = request.params as { id: string }
    const result = await deleteCompany(id)
    return result
  })
}