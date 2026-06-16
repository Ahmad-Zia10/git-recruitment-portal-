import { FastifyRequest, FastifyReply } from 'fastify'
import { ForbiddenError } from '../errors'

type UserRole = 'admin' | 'recruiter' | 'account_manager' | 'finance' | 'viewer'

const roleHierarchy: Record<UserRole, number> = {
  admin: 5,
  recruiter: 4,
  account_manager: 3,
  finance: 2,
  viewer: 1,
}

function createRoleGuard(allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id: string; role: UserRole }

    if (!user || !allowedRoles.includes(user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action')
    }
  }
}

// ─── Role Guards ───────────────────────────────────────────
export const requireAdmin = createRoleGuard(['admin'])

export const requireFinance = createRoleGuard(['admin', 'finance'])

export const requireRecruiter = createRoleGuard(['admin', 'recruiter'])

export const requireAccountManager = createRoleGuard(['admin', 'account_manager'])

export const requireRecruiterOrAccountManager = createRoleGuard([
  'admin',
  'recruiter',
  'account_manager',
])

export const requireAnyRole = createRoleGuard([
  'admin',
  'recruiter',
  'account_manager',
  'finance',
  'viewer',
])