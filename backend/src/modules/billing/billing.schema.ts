import { z } from 'zod'

export const CreateBillingRecordSchema = z.object({
  application_id: z.string().uuid('Invalid application ID'),
  demand_per_month: z.number().positive().max(1000000),
  bill_to_customer_gbp_monthly: z.number().positive().max(1000000),
  margin_per_month_inr: z.number().min(0).optional(),
  invoice_ref: z.string().max(100).optional(),
  billing_period_start: z.string().datetime().optional(),
  billing_period_end: z.string().datetime().optional(),
  payment_status: z.enum(['pending', 'invoiced', 'paid', 'overdue']).default('pending'),
  notes: z.string().max(5000).optional(),
})

export const UpdateBillingRecordSchema = CreateBillingRecordSchema.partial().omit({
  application_id: true,
})

export const BillingQuerySchema = z.object({
  payment_status: z.enum(['pending', 'invoiced', 'paid', 'overdue']).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(100).default(20),
})

export type CreateBillingRecordInput = z.infer<typeof CreateBillingRecordSchema>
export type UpdateBillingRecordInput = z.infer<typeof UpdateBillingRecordSchema>
export type BillingQuery = z.infer<typeof BillingQuerySchema>