export type PaymentStatus = 'pending' | 'invoiced' | 'paid' | 'overdue';

export interface BillingApplicationRef {
  id: string;
  status: string;
  candidate?: { id: string; full_name: string; email: string };
  job_opening?: {
    id: string;
    company?: { id: string; name: string };
    role?: { id: string; title: string };
  };
}

export interface BillingRecord {
  id: string;
  application_id: string;
  demand_per_month: number;
  bill_to_customer_gbp_monthly: number;
  margin_per_month_inr?: number | null;
  invoice_ref?: string | null;
  billing_period_start?: string | null;
  billing_period_end?: string | null;
  payment_status: PaymentStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  application?: BillingApplicationRef;
}

export interface BillingListParams {
  payment_status?: PaymentStatus;
  page?: number;
  limit?: number;
}
