import { z } from 'zod';

export const applicationStatusSchema = z.enum([
  'shortlisted',
  'screening',
  'interviewing',
  'offered',
  'placed',
  'rejected',
  'withdrawn',
]);

export const createApplicationFormSchema = z.object({
  job_opening_id: z.string().uuid('Please select a requirement'),
  candidate_id: z.string().uuid('Please select a candidate'),
  expected_availability: z.string().optional(),
  notes: z.string().max(5000).optional(),
});

export type CreateApplicationFormValues = z.infer<typeof createApplicationFormSchema>;

export const createApplicationFormDefaults: CreateApplicationFormValues = {
  job_opening_id: '',
  candidate_id: '',
  expected_availability: '',
  notes: '',
};

export function toCreateApplicationPayload(values: CreateApplicationFormValues) {
  const parsed = createApplicationFormSchema.parse(values);
  const payload: Record<string, unknown> = {
    job_opening_id: parsed.job_opening_id,
    candidate_id: parsed.candidate_id,
    status: 'shortlisted',
  };

  if (parsed.expected_availability) {
    payload.expected_availability = new Date(parsed.expected_availability).toISOString();
  }
  if (parsed.notes?.trim()) {
    payload.notes = parsed.notes.trim();
  }

  return payload;
}
