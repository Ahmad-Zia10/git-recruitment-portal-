import { FastifyInstance } from 'fastify'
import { verifyToken } from '../../shared/middleware/auth.middleware'
import { RoleQuerySchema, CreateRoleSchema, UpdateRoleSchema } from './role.schema'
import { listRoles, getRoleById, createRole, updateRole, deleteRole } from './role.service'

export async function roleRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyToken)

  app.get('/', async (request) => {
    const query = RoleQuerySchema.parse(request.query)
    const result = await listRoles(query)
    return { success: true, ...result }
  })

  app.get('/:id', async (request) => {
    const { id } = request.params as { id: string }
    const data = await getRoleById(id)
    return { success: true, data }
  })

  app.post('/', async (request, reply) => {
    const body = CreateRoleSchema.parse(request.body)
    const data = await createRole(body)
    return reply.status(201).send({ success: true, data })
  })

  app.put('/:id', async (request) => {
    const { id } = request.params as { id: string }
    const body = UpdateRoleSchema.parse(request.body)
    const data = await updateRole(id, body)
    return { success: true, data }
  })

  app.delete('/:id', async (request) => {
    const { id } = request.params as { id: string }
    await deleteRole(id)
    return { success: true, message: 'Role deleted' }
  })
}