import { z } from 'zod'

export const CreateCandidateSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  alternate_phone: z.string().optional(),
  linkedin_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
  portfolio_url: z.string().url().optional(),
  date_of_birth: z.string().datetime().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  current_location: z.string().optional(),
  preferred_location: z.string().optional(),
  willing_to_relocate: z.boolean().optional(),
  exp_years: z.number().int().min(0),
  current_company: z.string().optional(),
  current_role: z.string().optional(),
  current_ctc: z.number().optional(),
  expected_ctc: z.number().optional(),
  expected_day_rate: z.number().optional(),
  currency: z.string().length(3).default('GBP'),
  notice_period_days: z.number().int().optional(),
  availability_date: z.string().datetime().optional(),
  availability_status: z.enum([
    'immediate',
    'notice_period',
    'not_looking',
    'open_to_opportunities',
  ]),
  highest_qualification: z.string().optional(),
  source: z
    .enum(['referral', 'linkedin', 'job_board', 'direct', 'agency'])
    .optional(),
  referred_by: z.string().optional(),
  status: z.enum(['active', 'placed', 'inactive', 'blacklisted']).default('active'),
  notes: z.string().optional(),
})

export const UpdateCandidateSchema = CreateCandidateSchema.partial()

export const CandidateQuerySchema = z.object({
  status: z.enum(['active', 'placed', 'inactive', 'blacklisted']).optional(),
  availability_status: z
    .enum(['immediate', 'notice_period', 'not_looking', 'open_to_opportunities'])
    .optional(),
  min_exp: z.coerce.number().optional(),
  max_exp: z.coerce.number().optional(),
  sortBy: z.enum(['created_at', 'exp_years', 'availability_date']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
})

export const CreateSkillSchema = z.object({
  skill: z.string().min(1, 'Skill is required'),
  years_exp: z.number().int().optional(),
  proficiency: z
    .enum(['beginner', 'intermediate', 'advanced', 'expert'])
    .optional(),
  is_primary: z.boolean().default(false),
})

export const CreateWorkHistorySchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  role_title: z.string().min(1, 'Role title is required'),
  employment_type: z.enum([
    'full_time',
    'part_time',
    'contract',
    'freelance',
    'internship',
  ]),
  location: z.string().optional(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().optional(),
  is_current: z.boolean().default(false),
  responsibilities: z.string().optional(),
  achievements: z.string().optional(),
  technologies_used: z.array(z.string()).default([]),
})

export const CreateEducationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field_of_study: z.string().optional(),
  grade: z.string().optional(),
  start_year: z.number().int().optional(),
  end_year: z.number().int().optional(),
  is_current: z.boolean().default(false),
})

export const CreateCertificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuing_organization: z.string().min(1, 'Issuing organization is required'),
  issue_date: z.string().datetime().optional(),
  expiry_date: z.string().datetime().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().url().optional(),
})

export const CreateLanguageSchema = z.object({
  language: z.string().min(1, 'Language is required'),
  proficiency: z.enum(['basic', 'conversational', 'professional', 'native']),
})

export type CreateCandidateInput = z.infer<typeof CreateCandidateSchema>
export type UpdateCandidateInput = z.infer<typeof UpdateCandidateSchema>
export type CandidateQuery = z.infer<typeof CandidateQuerySchema>
export type CreateSkillInput = z.infer<typeof CreateSkillSchema>
export type CreateWorkHistoryInput = z.infer<typeof CreateWorkHistorySchema>
export type CreateEducationInput = z.infer<typeof CreateEducationSchema>
export type CreateCertificationInput = z.infer<typeof CreateCertificationSchema>
export type CreateLanguageInput = z.infer<typeof CreateLanguageSchema>