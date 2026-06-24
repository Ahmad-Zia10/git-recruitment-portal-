import { z } from 'zod'

export const CreateJobOpeningSchema = z.object({
  company_id: z.string().uuid('Invalid company ID'),
  role_id: z.string().uuid('Invalid role ID'),
  status: z.enum(['open', 'on_hold', 'filled', 'cancelled']).default('open'),
  min_exp_years: z.number().int().min(0).max(60),
  max_exp_years: z.number().int().min(0).max(60),
  budget_min: z.number().min(0).optional(),
  budget_max: z.number().min(0).optional(),
  budget_currency: z.string().length(3).default('GBP'),
  hiring_type: z.enum(['contract', 'permanent', 'fixed_term']),
  min_contract_months: z.number().int().min(1).max(60).optional(),
  expected_start_date: z.string().datetime().optional(),
  notice_period_buyback: z.boolean().default(false),
  no_of_positions: z.number().int().min(1).max(1000),
  location: z.string().min(1, 'Location is required').max(100),
  work_mode: z.enum(['onsite', 'remote', 'hybrid']),
  job_description: z.string().max(10000).optional(),
  required_skills: z.array(z.string().max(50)).max(30).default([]),
  nice_to_have_skills: z.array(z.string().max(50)).max(30).default([]),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  closing_date: z.string().datetime().optional(),
})

export const UpdateJobOpeningSchema = CreateJobOpeningSchema.partial()

export const JobOpeningQuerySchema = z.object({
  status: z.enum(['open', 'on_hold', 'filled', 'cancelled']).optional(),
  hiring_type: z.enum(['contract', 'permanent', 'fixed_term']).optional(),
  work_mode: z.enum(['onsite', 'remote', 'hybrid']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  company_id: z.string().uuid().optional(),
  role_id: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(100).default(20),
  sortBy: z.enum(['created_at', 'priority', 'expected_start_date', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const SuggestedCandidatesQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(100).default(20),
})

export type SuggestedCandidatesQuery = z.infer<typeof SuggestedCandidatesQuerySchema>
export type CreateJobOpeningInput = z.infer<typeof CreateJobOpeningSchema>
export type UpdateJobOpeningInput = z.infer<typeof UpdateJobOpeningSchema>
export type JobOpeningQuery = z.infer<typeof JobOpeningQuerySchema>