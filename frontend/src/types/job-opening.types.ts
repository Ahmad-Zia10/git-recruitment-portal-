export type JobOpeningStatus = 'open' | 'on_hold' | 'filled' | 'cancelled';
export type HiringType = 'contract' | 'permanent' | 'fixed_term';
export type WorkMode = 'onsite' | 'remote' | 'hybrid';
export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface JobOpeningCompany {
  id: string;
  name: string;
  industry?: string | null;
  city?: string | null;
}

export interface JobOpeningRole {
  id: string;
  title: string;
  category?: string | null;
}

export interface JobOpening {
  id: string;
  company_id: string;
  role_id: string;
  status: JobOpeningStatus;
  min_exp_years: number;
  max_exp_years: number;
  budget_min?: number | null;
  budget_max?: number | null;
  budget_currency: string;
  hiring_type: HiringType;
  min_contract_months?: number | null;
  expected_start_date?: string | null;
  notice_period_buyback: boolean;
  no_of_positions: number;
  location: string;
  work_mode: WorkMode;
  job_description?: string | null;
  required_skills: string[];
  nice_to_have_skills: string[];
  priority: JobPriority;
  closing_date?: string | null;
  created_at: string;
  updated_at: string;
  company?: JobOpeningCompany;
  role?: JobOpeningRole;
}

export interface JobOpeningListParams {
  search?: string;
  status?: JobOpeningStatus;
  hiring_type?: HiringType;
  work_mode?: WorkMode;
  priority?: JobPriority;
  company_id?: string;
  role_id?: string;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'priority' | 'expected_start_date' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface JobOpeningListFilters {
  search: string;
  status: string;
  hiringType: string;
  page: number;
}
