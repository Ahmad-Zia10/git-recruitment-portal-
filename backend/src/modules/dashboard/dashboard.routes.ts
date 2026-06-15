import { FastifyInstance } from 'fastify'
import { verifyToken } from '../../shared/middleware/auth.middleware'
import { getDashboardAggregates } from './dashboard.service'

export async function dashboardRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyToken)

  app.get('/', async () => {
    const data = await getDashboardAggregates()
    return { success: true, data }
  })
}