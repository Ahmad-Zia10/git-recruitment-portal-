export type CompanyStatus = 'active' | 'inactive' | 'prospect';

export interface CompanyAccountManager {
  id: string;
  full_name: string;
  email: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string | null;
  website?: string | null;
  country?: string | null;
  city?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  status: CompanyStatus;
  notes?: string | null;
  account_manager_id?: string | null;
  created_at: string;
  updated_at: string;
  account_manager?: CompanyAccountManager | null;
}

export interface CompanyListParams {
  search?: string;
  status?: CompanyStatus;
  page?: number;
  limit?: number;
}
