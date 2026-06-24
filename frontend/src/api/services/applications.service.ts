import apiClient from '../client';
import type { ApiListResponse, ApiSuccessResponse } from '../types/api.types';
import type {
  Application,
  ApplicationListParams,
  UpdateApplicationStatusInput,
  CreateInterviewRoundInput,
  InterviewRound,
} from '../../types/application.types';
import type { CreateApplicationFormValues } from '../../schemas/application.schema';
import { toCreateApplicationPayload } from '../../schemas/application.schema';

export async function listApplications(params: ApplicationListParams = {}) {
  const response = await apiClient.get<ApiListResponse<Application>>('/applications', {
    params: {
      page: params.page,
      limit: params.limit,
      status: params.status,
      company_id: params.company_id,
      candidate_id: params.candidate_id,
      job_opening_id: params.job_opening_id,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    },
  });
  return response.data;
}

export async function getApplicationById(id: string) {
  const response = await apiClient.get<ApiSuccessResponse<Application>>(`/applications/${id}`);
  return response.data.data;
}

export async function createApplication(values: CreateApplicationFormValues) {
  const payload = toCreateApplicationPayload(values);
  const response = await apiClient.post<ApiSuccessResponse<Application>>('/applications', payload);
  return response.data.data;
}

export async function updateApplicationStatus(
  id: string,
  input: UpdateApplicationStatusInput
) {
  const response = await apiClient.patch<ApiSuccessResponse<Application>>(
    `/applications/${id}/status`,
    input
  );
  return response.data.data;
}

export async function recalculateMatchScore(id: string) {
  const response = await apiClient.post<ApiSuccessResponse<Application>>(
    `/applications/${id}/recalculate-score`
  );
  return response.data.data;
}

export async function addInterviewRound(applicationId: string, input: CreateInterviewRoundInput) {
  const response = await apiClient.post<ApiSuccessResponse<InterviewRound>>(
    `/applications/${applicationId}/interviews`,
    input
  );
  return response.data.data;
}

export async function updateInterviewRound(
  applicationId: string,
  roundId: string,
  input: Partial<CreateInterviewRoundInput>
) {
  const response = await apiClient.patch<ApiSuccessResponse<InterviewRound>>(
    `/applications/${applicationId}/interviews/${roundId}`,
    input
  );
  return response.data.data;
}
