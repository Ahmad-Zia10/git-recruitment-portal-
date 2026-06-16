import { FastifyInstance } from 'fastify'
import { verifyToken } from '../../shared/middleware/auth.middleware'
import { requireFinance } from '../../shared/middleware/rbac.middleware'
import {
  BillingQuerySchema,
  CreateBillingRecordSchema,
  UpdateBillingRecordSchema,
} from './billing.schema'
import {
  listBillingRecords,
  getBillingById,
  createBillingRecord,
  updateBillingRecord,
} from './billing.service'

export async function billingRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyToken)

  // Only admin and finance can access billing
  app.get('/', { preHandler: requireFinance }, async (request) => {
    const query = BillingQuerySchema.parse(request.query)
    const result = await listBillingRecords(query)
    return { success: true, ...result }
  })

  app.get('/:id', { preHandler: requireFinance }, async (request) => {
    const { id } = request.params as { id: string }
    const data = await getBillingById(id)
    return { success: true, data }
  })

  app.post('/', { preHandler: requireFinance }, async (request, reply) => {
    const body = CreateBillingRecordSchema.parse(request.body)
    const data = await createBillingRecord(body)
    return reply.status(201).send({ success: true, data })
  })

  app.put('/:id', { preHandler: requireFinance }, async (request) => {
    const { id } = request.params as { id: string }
    const body = UpdateBillingRecordSchema.parse(request.body)
    const data = await updateBillingRecord(id, body)
    return { success: true, data }
  })
}