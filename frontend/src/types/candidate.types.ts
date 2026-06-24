export type CandidateStatus = 'active' | 'placed' | 'inactive' | 'blacklisted';

export type AvailabilityStatus =
  | 'immediate'
  | 'notice_period'
  | 'not_looking'
  | 'open_to_opportunities';

export type CandidateSource = 'referral' | 'linkedin' | 'job_board' | 'direct' | 'agency';

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  exp_years: number;
  currency: string;
  expected_day_rate?: number | null;
  availability_status: AvailabilityStatus;
  preferred_location?: string | null;
  current_location?: string | null;
  current_role?: string | null;
  current_company?: string | null;
  source?: CandidateSource | null;
  status: CandidateStatus;
  created_at: string;
  updated_at: string;
}

export interface CandidateListParams {
  search?: string;
  status?: CandidateStatus;
  page?: number;
  limit?: number;
}

export interface CreateSkillInput {
  skill: string;
  is_primary?: boolean;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}
