import apiClient from '../client';
import type { ApiListResponse } from '../types/api.types';
import type { Role, RoleListParams } from '../../types/role.types';

export async function listRoles(params: RoleListParams = {}) {
  const response = await apiClient.get<ApiListResponse<Role>>('/roles', {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      category: params.category,
    },
  });
  return response.data;
}
