import { FastifyInstance } from 'fastify'
import { verifyToken } from '../../shared/middleware/auth.middleware'
import { requireAnyRole } from '../../shared/middleware/rbac.middleware'
import { getDashboardAggregates } from './dashboard.service'

export async function dashboardRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyToken)

  app.get('/', { preHandler: requireAnyRole }, async () => {
    const data = await getDashboardAggregates()
    return { success: true, data }
  })
}