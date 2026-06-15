import { z } from 'zod'

export const CreateApplicationSchema = z.object({
  job_opening_id: z.string().uuid('Invalid job opening ID'),
  candidate_id: z.string().uuid('Invalid candidate ID'),
  status: z.enum([
    'shortlisted',
    'screening',
    'interviewing',
    'offered',
    'placed',
    'rejected',
    'withdrawn',
  ]).default('shortlisted'),
  expected_availability: z.string().datetime().optional(),
  notes: z.string().max(5000).optional(),
})

export const UpdateApplicationStatusSchema = z.object({
  status: z.enum([
    'shortlisted',
    'screening',
    'interviewing',
    'offered',
    'placed',
    'rejected',
    'withdrawn',
  ]),
  rejection_reason: z.string().max(1000).optional(),
  offer_date: z.string().datetime().optional(),
  placed_date: z.string().datetime().optional(),
})

export const ApplicationQuerySchema = z.object({
  status: z.enum([
    'shortlisted',
    'screening',
    'interviewing',
    'offered',
    'placed',
    'rejected',
    'withdrawn',
  ]).optional(),
  company_id: z.string().uuid().optional(),
  candidate_id: z.string().uuid().optional(),
  job_opening_id: z.string().uuid().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(100).default(20),
  sortBy: z.enum(['applied_at', 'updated_at', 'match_score', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const CreateInterviewRoundSchema = z.object({
  round_number: z.number().int().min(1).max(20),
  round_type: z.enum(['screening', 'technical', 'hr', 'cultural_fit', 'final']),
  scheduled_at: z.string().datetime().optional(),
  conducted_by: z.string().max(100).optional(),
  mode: z.enum(['video', 'phone', 'onsite']).optional(),
  outcome: z.enum(['passed', 'failed', 'no_show', 'rescheduled']).optional(),
  feedback: z.string().max(5000).optional(),
})

export const UpdateInterviewRoundSchema = CreateInterviewRoundSchema.partial()

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>
export type UpdateApplicationStatusInput = z.infer<typeof UpdateApplicationStatusSchema>
export type ApplicationQuery = z.infer<typeof ApplicationQuerySchema>
export type CreateInterviewRoundInput = z.infer<typeof CreateInterviewRoundSchema>
export type UpdateInterviewRoundInput = z.infer<typeof UpdateInterviewRoundSchema>