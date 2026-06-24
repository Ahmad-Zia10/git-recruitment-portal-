import type { ApplicationStatus } from '../lib/status-machine';

export interface DashboardSummary {
  total_active_openings: number;
  total_candidates: number;
  applications_this_month: number;
  total_placed: number;
  total_clients: number;
  billing_summary: number;
}

export interface DashboardRecentApplication {
  id: string;
  status: ApplicationStatus;
  match_score?: number | null;
  applied_at: string;
  candidate?: { id: string; full_name: string; current_role?: string | null };
  job_opening?: {
    id: string;
    role?: { title: string };
    company?: { name: string };
  };
}

export interface DashboardAggregates {
  summary: DashboardSummary;
  openings_by_priority: Record<string, number>;
  applications_by_status: Record<string, number>;
  recent_applications: DashboardRecentApplication[];
}
