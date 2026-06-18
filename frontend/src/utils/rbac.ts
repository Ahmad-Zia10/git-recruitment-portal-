import { useAuthStore } from '../store/authStore';

export type Role = 'admin' | 'recruiter' | 'account_manager' | 'finance' | 'viewer';

const rolePermissions: Record<Role, string[]> = {
  admin: ['*'],
  recruiter: [
    'view_jobs', 'create_job', 'edit_job', 
    'view_candidates', 'create_candidate', 'edit_candidate',
    'view_applications', 'create_application', 'edit_application'
  ],
  account_manager: [
    'view_companies', 'create_company', 'edit_company',
    'view_jobs',
    'view_applications'
  ],
  finance: [
    'view_billing', 'create_billing'
  ],
  viewer: [
    'view_jobs', 'view_candidates', 'view_applications', 'view_companies'
  ]
};

export const hasPermission = (permission: string): boolean => {
  const user = useAuthStore.getState().user;
  if (!user) return false;
  
  const permissions = rolePermissions[user.role];
  if (!permissions) return false;
  
  if (permissions.includes('*')) return true;
  return permissions.includes(permission);
};
