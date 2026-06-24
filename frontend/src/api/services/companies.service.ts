import apiClient from '../client';
import type { ApiListResponse, ApiSuccessResponse } from '../types/api.types';
import type { Company, CompanyListParams } from '../../types/company.types';
import type { CreateCompanyFormValues } from '../../schemas/company.schema';
import { toCreateCompanyPayload } from '../../schemas/company.schema';

export async function listCompanies(params: CompanyListParams = {}) {
  const response = await apiClient.get<ApiListResponse<Company>>('/companies', {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status,
    },
  });
  return response.data;
}

export async function getCompanyById(id: string) {
  const response = await apiClient.get<ApiSuccessResponse<Company>>(`/companies/${id}`);
  return response.data.data;
}

export async function createCompany(values: CreateCompanyFormValues) {
  const payload = toCreateCompanyPayload(values);
  const response = await apiClient.post<ApiSuccessResponse<Company>>('/companies', payload);
  return response.data.data;
}
