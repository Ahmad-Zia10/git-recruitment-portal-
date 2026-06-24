import type { ApplicationStatus } from '../lib/status-machine';
import type { Candidate } from './candidate.types';
import type { JobOpening } from './job-opening.types';

export interface ApplicationCreator {
  id: string;
  full_name: string;
}

export interface InterviewRound {
  id: string;
  application_id: string;
  round_number: number;
  round_type: 'screening' | 'technical' | 'hr' | 'cultural_fit' | 'final';
  scheduled_at?: string | null;
  conducted_by?: string | null;
  mode?: 'video' | 'phone' | 'onsite' | null;
  outcome?: 'passed' | 'failed' | 'no_show' | 'rescheduled' | null;
  feedback?: string | null;
  created_at: string;
  updated_at: string;
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
  interview_rounds?: InterviewRound[];
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

export interface CreateInterviewRoundInput {
  round_number: number;
  round_type: InterviewRound['round_type'];
  scheduled_at?: string;
  conducted_by?: string;
  mode?: NonNullable<InterviewRound['mode']>;
  outcome?: NonNullable<InterviewRound['outcome']>;
  feedback?: string;
}
