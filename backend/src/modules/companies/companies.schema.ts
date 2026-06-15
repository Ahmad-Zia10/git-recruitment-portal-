import { z } from 'zod'

export const CreateCompanySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  industry: z.string().max(100).optional(),
  website: z.string().url().max(255).optional(),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  contact_name: z.string().max(100).optional(),
  contact_email: z.string().email().max(255).optional(),
  contact_phone: z.string().max(20).optional(),
  account_manager_id: z.string().uuid().optional(),
  status: z.enum(['active', 'inactive', 'prospect']).default('prospect'),
  notes: z.string().max(5000).optional(),
})

export const UpdateCompanySchema = CreateCompanySchema.partial()

export const CompanyQuerySchema = z.object({
  status: z.enum(['active', 'inactive', 'prospect']).optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(100).default(20),
})

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>
export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>
export type CompanyQuery = z.infer<typeof CompanyQuerySchema>