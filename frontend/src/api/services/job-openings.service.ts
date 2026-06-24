import apiClient from '../client';
import type { ApiListResponse, ApiSuccessResponse } from '../types/api.types';
import type { JobOpening, JobOpeningListParams, SuggestedCandidate } from '../../types/job-opening.types';
import type { CreateJobOpeningFormValues } from '../../schemas/job-opening.schema';
import { toCreateJobOpeningPayload } from '../../schemas/job-opening.schema';

export async function listJobOpenings(params: JobOpeningListParams = {}) {
  const response = await apiClient.get<ApiListResponse<JobOpening>>('/job-openings', {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status,
      hiring_type: params.hiring_type,
      work_mode: params.work_mode,
      priority: params.priority,
      company_id: params.company_id,
      role_id: params.role_id,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    },
  });
  return response.data;
}

export async function getJobOpeningById(id: string) {
  const response = await apiClient.get<ApiSuccessResponse<JobOpening>>(`/job-openings/${id}`);
  return response.data.data;
}

export async function createJobOpening(values: CreateJobOpeningFormValues) {
  const payload = toCreateJobOpeningPayload(values);
  const response = await apiClient.post<ApiSuccessResponse<JobOpening>>('/job-openings', payload);
  return response.data.data;
}

export async function getSuggestedCandidates(jobOpeningId: string, page = 1, limit = 10) {
  const response = await apiClient.get<ApiListResponse<SuggestedCandidate>>(
    `/job-openings/${jobOpeningId}/suggested-candidates`,
    { params: { page, limit } }
  );
  return response.data;
}

export async function updateJobOpening(id: string, values: CreateJobOpeningFormValues) {
  const payload = toCreateJobOpeningPayload(values);
  const response = await apiClient.put<ApiSuccessResponse<JobOpening>>(`/job-openings/${id}`, payload);
  return response.data.data;
}

export async function deleteJobOpening(id: string) {
  await apiClient.delete(`/job-openings/${id}`);
}
