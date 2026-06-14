import { z } from 'zod'

export const CreateCompanySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  industry: z.string().optional(),
  website: z.string().url().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  account_manager_id: z.string().uuid().optional(),
  status: z.enum(['active', 'inactive', 'prospect']).default('prospect'),
  notes: z.string().optional(),
})

export const UpdateCompanySchema = CreateCompanySchema.partial()

export const CompanyQuerySchema = z.object({
  status: z.enum(['active', 'inactive', 'prospect']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
})

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>
export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>
export type CompanyQuery = z.infer<typeof CompanyQuerySchema>