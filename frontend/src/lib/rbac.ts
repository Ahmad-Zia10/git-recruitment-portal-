import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../api/types/api.types';

/**
 * UI permissions aligned with backend route guards (rbac.middleware.ts).
 * Action permissions control buttons/forms; route access uses hasRole where needed.
 */
export type Permission =
  | 'view_dashboard'
  | 'view_companies'
  | 'create_company'
  | 'edit_company'
  | 'view_jobs'
  | 'create_job'
  | 'edit_job'
  | 'view_candidates'
  | 'create_candidate'
  | 'edit_candidate'
  | 'view_applications'
  | 'create_application'
  | 'edit_application'
  | 'view_billing'
  | 'create_billing'
  | 'edit_billing';

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: ['view_dashboard', 'view_companies', 'create_company', 'edit_company', 'view_jobs', 'create_job', 'edit_job', 'view_candidates', 'create_candidate', 'edit_candidate', 'view_applications', 'create_application', 'edit_application', 'view_billing', 'create_billing', 'edit_billing'],
  recruiter: [
    'view_dashboard',
    'view_companies',
    'view_jobs',
    'create_job',
    'edit_job',
    'view_candidates',
    'create_candidate',
    'edit_candidate',
    'view_applications',
    'create_application',
    'edit_application',
  ],
  account_manager: [
    'view_dashboard',
    'view_companies',
    'create_company',
    'edit_company',
    'view_jobs',
    'create_job',
    'edit_job',
    'view_applications',
  ],
  finance: ['view_dashboard', 'view_billing', 'create_billing', 'edit_billing'],
  viewer: [
    'view_dashboard',
    'view_companies',
    'view_jobs',
    'view_candidates',
    'view_applications',
  ],
};

/** Routes restricted to specific roles (mirrors backend requireFinance, etc.) */
export const routeRoleAccess: Record<string, UserRole[]> = {
  '/billing': ['admin', 'finance'],
};

export function hasRole(...roles: UserRole[]): boolean {
  const user = useAuthStore.getState().user;
  if (!user) return false;
  return roles.includes(user.role);
}

export function hasPermission(permission: Permission): boolean {
  const user = useAuthStore.getState().user;
  if (!user) return false;

  const permissions = rolePermissions[user.role];
  if (!permissions) return false;

  return permissions.includes(permission);
}

export function canAccessRoute(pathname: string): boolean {
  const roles = routeRoleAccess[pathname];
  if (!roles) return true;
  return hasRole(...roles);
}
