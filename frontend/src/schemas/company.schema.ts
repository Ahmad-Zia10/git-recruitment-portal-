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

/** Strip empty strings so optional backend fields pass Zod validation. */
export function toCreateCompanyPayload(values: CreateCompanyFormValues) {
  const parsed = createCompanyFormSchema.parse(values);
  const payload: Record<string, unknown> = { name: parsed.name, status: parsed.status };

  if (parsed.industry) payload.industry = parsed.industry;
  if (parsed.country) payload.country = parsed.country;
  if (parsed.city) payload.city = parsed.city;
  if (parsed.contact_name) payload.contact_name = parsed.contact_name;
  if (parsed.contact_email) payload.contact_email = parsed.contact_email;
  if (parsed.contact_phone) payload.contact_phone = parsed.contact_phone;

  return payload;
}

export const toUpdateCompanyPayload = toCreateCompanyPayload;
