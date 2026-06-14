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
  notes: z.string().optional(),
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
  rejection_reason: z.string().optional(),
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
  limit: z.coerce.number().default(20),
})

export const CreateInterviewRoundSchema = z.object({
  round_number: z.number().int().min(1),
  round_type: z.enum(['screening', 'technical', 'hr', 'cultural_fit', 'final']),
  scheduled_at: z.string().datetime().optional(),
  conducted_by: z.string().optional(),
  mode: z.enum(['video', 'phone', 'onsite']).optional(),
  outcome: z.enum(['passed', 'failed', 'no_show', 'rescheduled']).optional(),
  feedback: z.string().optional(),
})

export const UpdateInterviewRoundSchema = CreateInterviewRoundSchema.partial()

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>
export type UpdateApplicationStatusInput = z.infer<typeof UpdateApplicationStatusSchema>
export type ApplicationQuery = z.infer<typeof ApplicationQuerySchema>
export type CreateInterviewRoundInput = z.infer<typeof CreateInterviewRoundSchema>
export type UpdateInterviewRoundInput = z.infer<typeof UpdateInterviewRoundSchema>