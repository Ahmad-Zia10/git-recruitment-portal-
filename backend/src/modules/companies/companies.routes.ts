import { FastifyInstance } from 'fastify'
import { verifyToken } from '../../shared/middleware/auth.middleware'
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

  app.get('/', async (request) => {
    const query = CompanyQuerySchema.parse(request.query)
    const result = await listCompanies(query)
    return { success: true, ...result }
  })

  app.get('/:id', async (request) => {
    const { id } = request.params as { id: string }
    const data = await getCompanyById(id)
    return { success: true, data }
  })

  app.post('/', async (request, reply) => {
    const body = CreateCompanySchema.parse(request.body)
    const data = await createCompany(body)
    return reply.status(201).send({ success: true, data })
  })

  app.put('/:id', async (request) => {
    const { id } = request.params as { id: string }
    const body = UpdateCompanySchema.parse(request.body)
    const data = await updateCompany(id, body)
    return { success: true, data }
  })

  app.delete('/:id', async (request) => {
    const { id } = request.params as { id: string }
    await deleteCompany(id)
    return { success: true, message: 'Company deleted' }
  })
}