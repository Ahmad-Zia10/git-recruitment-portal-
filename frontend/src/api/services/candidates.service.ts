import apiClient from '../client';
import type { ApiListResponse, ApiSuccessResponse } from '../types/api.types';
import type {
  Candidate,
  CandidateListParams,
  CreateSkillInput,
} from '../../types/candidate.types';
import type { CreateCandidateFormValues } from '../../schemas/candidate.schema';
import { toCreateCandidatePayload } from '../../schemas/candidate.schema';

export async function listCandidates(params: CandidateListParams = {}) {
  const response = await apiClient.get<ApiListResponse<Candidate>>('/candidates', {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status,
    },
  });
  return response.data;
}

export async function getCandidateById(id: string) {
  const response = await apiClient.get<ApiSuccessResponse<Candidate>>(`/candidates/${id}`);
  return response.data.data;
}

export async function createCandidate(values: CreateCandidateFormValues) {
  const payload = toCreateCandidatePayload(values);
  const response = await apiClient.post<ApiSuccessResponse<Candidate>>('/candidates', payload);
  return response.data.data;
}

export async function addCandidateSkill(candidateId: string, skill: CreateSkillInput) {
  const response = await apiClient.post<ApiSuccessResponse<unknown>>(
    `/candidates/${candidateId}/skills`,
    skill
  );
  return response.data.data;
}
