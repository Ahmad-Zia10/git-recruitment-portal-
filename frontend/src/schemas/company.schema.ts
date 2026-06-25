import { z } from 'zod';

export const companyStatusSchema = z.enum(['active', 'inactive', 'prospect']);

export const createCompanyFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  industry: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  contact_name: z.string().max(100).optional(),
  contact_email: z
    .union([z.literal(''), z.string().email('Invalid email address').max(255)])
    .optional(),
  contact_phone: z.string().max(20).optional(),
  status: companyStatusSchema.default('active'),
});

export type CreateCompanyFormValues = z.infer<typeof createCompanyFormSchema>;

export const createCompanyFormDefaults: CreateCompanyFormValues = {
  name: '',
  industry: '',
  country: '',
  city: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  status: 'active',
};

export function toCreateCompanyPayload(values: CreateCompanyFormValues) {
  const parsed = createCompanyFormSchema.parse(values);
  const payload: Record<string, unknown> = { 
    name: parsed.name, 
    status: parsed.status,
    industry: parsed.industry,
    country: parsed.country,
    city: parsed.city,
    contact_name: parsed.contact_name,
    contact_email: parsed.contact_email,
    contact_phone: parsed.contact_phone
  };

  return payload;
}

export const toUpdateCompanyPayload = toCreateCompanyPayload;
