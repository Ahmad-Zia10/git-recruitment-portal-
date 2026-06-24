import apiClient from '../client';
import type { ApiListResponse, ApiSuccessResponse } from '../types/api.types';
import type { BillingListParams, BillingRecord } from '../../types/billing.types';
import type { CreateBillingFormInput, UpdateBillingFormInput } from '../../schemas/billing.schema';
import { toCreateBillingPayload, toUpdateBillingPayload } from '../../schemas/billing.schema';

export async function listBillingRecords(params: BillingListParams = {}) {
  const response = await apiClient.get<ApiListResponse<BillingRecord>>('/billing', {
    params: {
      page: params.page,
      limit: params.limit,
      payment_status: params.payment_status,
    },
  });
  return response.data;
}

export async function getBillingRecordById(id: string) {
  const response = await apiClient.get<ApiSuccessResponse<BillingRecord>>(`/billing/${id}`);
  return response.data.data;
}

export async function createBillingRecord(values: CreateBillingFormInput) {
  const payload = toCreateBillingPayload(values);
  const response = await apiClient.post<ApiSuccessResponse<BillingRecord>>('/billing', payload);
  return response.data.data;
}

export async function updateBillingRecord(id: string, values: UpdateBillingFormInput) {
  const payload = toUpdateBillingPayload(values);
  const response = await apiClient.put<ApiSuccessResponse<BillingRecord>>(`/billing/${id}`, payload);
  return response.data.data;
}
