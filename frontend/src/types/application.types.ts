import type { ApplicationStatus } from '../lib/status-machine';
import type { Candidate } from './candidate.types';
import type { JobOpening } from './job-opening.types';

export interface ApplicationCreator {
  id: string;
  full_name: string;
}

export interface Application {
  id: string;
  job_opening_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  match_score?: number | null;
  expected_availability?: string | null;
  notes?: string | null;
  rejection_reason?: string | null;
  offer_date?: string | null;
  placed_date?: string | null;
  applied_at: string;
  updated_at: string;
  created_by?: string | null;
  candidate?: Pick<
    Candidate,
    'id' | 'full_name' | 'email' | 'phone' | 'exp_years' | 'current_role' | 'availability_status'
  >;
  job_opening?: Pick<JobOpening, 'id' | 'location' | 'work_mode' | 'hiring_type'> & {
    serial_no?: number;
    company?: { id: string; name: string };
    role?: { id: string; title: string };
  };
  creator?: ApplicationCreator;
}

export interface ApplicationListParams {
  status?: ApplicationStatus;
  company_id?: string;
  candidate_id?: string;
  job_opening_id?: string;
  page?: number;
  limit?: number;
  sortBy?: 'applied_at' | 'updated_at' | 'match_score' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateApplicationStatusInput {
  status: ApplicationStatus;
  rejection_reason?: string;
  offer_date?: string;
  placed_date?: string;
}
