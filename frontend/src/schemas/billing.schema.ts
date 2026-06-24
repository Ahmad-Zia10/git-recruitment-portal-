import { z } from 'zod';

export const paymentStatusSchema = z.enum(['pending', 'invoiced', 'paid', 'overdue']);

export const createBillingFormInputSchema = z.object({
  application_id: z.string().uuid('Please select a placed allocation'),
  demand_per_month: z.string().min(1, 'Demand is required'),
  bill_to_customer_gbp_monthly: z.string().min(1, 'Bill amount is required'),
  margin_per_month_inr: z.string().optional(),
  invoice_ref: z.string().max(100).optional(),
  billing_period_start: z.string().optional(),
  billing_period_end: z.string().optional(),
  payment_status: paymentStatusSchema,
  notes: z.string().max(5000).optional(),
});

export type CreateBillingFormInput = z.infer<typeof createBillingFormInputSchema>;

export const createBillingFormDefaults: CreateBillingFormInput = {
  application_id: '',
  demand_per_month: '',
  bill_to_customer_gbp_monthly: '',
  margin_per_month_inr: '',
  invoice_ref: '',
  billing_period_start: '',
  billing_period_end: '',
  payment_status: 'pending',
  notes: '',
};

export function toCreateBillingPayload(values: CreateBillingFormInput) {
  const demand = Number(values.demand_per_month);
  const billAmount = Number(values.bill_to_customer_gbp_monthly);

  if (!Number.isFinite(demand) || demand <= 0) {
    throw new Error('Demand must be a positive number');
  }
  if (!Number.isFinite(billAmount) || billAmount <= 0) {
    throw new Error('Bill amount must be a positive number');
  }

  const payload: Record<string, unknown> = {
    application_id: values.application_id,
    demand_per_month: demand,
    bill_to_customer_gbp_monthly: billAmount,
    payment_status: values.payment_status,
  };

  if (values.margin_per_month_inr?.trim()) {
    payload.margin_per_month_inr = Number(values.margin_per_month_inr);
  }
  if (values.invoice_ref?.trim()) {
    payload.invoice_ref = values.invoice_ref.trim();
  }
  if (values.billing_period_start) {
    payload.billing_period_start = new Date(values.billing_period_start).toISOString();
  }
  if (values.billing_period_end) {
    payload.billing_period_end = new Date(values.billing_period_end).toISOString();
  }
  if (values.notes?.trim()) {
    payload.notes = values.notes.trim();
  }

  return payload;
}

export const updateBillingFormInputSchema = z.object({
  payment_status: paymentStatusSchema,
  invoice_ref: z.string().max(100).optional(),
  notes: z.string().max(5000).optional(),
});

export type UpdateBillingFormInput = z.infer<typeof updateBillingFormInputSchema>;

export function toUpdateBillingPayload(values: UpdateBillingFormInput) {
  const payload: Record<string, unknown> = { payment_status: values.payment_status };
  if (values.invoice_ref?.trim()) payload.invoice_ref = values.invoice_ref.trim();
  if (values.notes?.trim()) payload.notes = values.notes.trim();
  return payload;
}
