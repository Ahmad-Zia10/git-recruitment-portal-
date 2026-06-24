import { z } from 'zod';
import { parseCommaSeparatedList } from '../lib/formatters';
import type { HiringType, JobOpeningStatus, JobPriority, WorkMode } from '../types/job-opening.types';

export const jobOpeningStatusSchema = z.enum(['open', 'on_hold', 'filled', 'cancelled']);
export const hiringTypeSchema = z.enum(['contract', 'permanent', 'fixed_term']);
export const workModeSchema = z.enum(['onsite', 'remote', 'hybrid']);
export const jobPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const createJobOpeningFormSchema = z
  .object({
    company_id: z.string().min(1, 'Client is required').uuid('Invalid company ID'),
    role_id: z.string().min(1, 'Role is required').uuid('Invalid role ID'),
    status: jobOpeningStatusSchema.default('open'),
    min_exp_years: z.coerce.number().int().min(0).max(60),
    max_exp_years: z.coerce.number().int().min(0).max(60),
    budget_min: z.string().optional(),
    budget_max: z.string().optional(),
    budget_currency: z.string().length(3, 'Currency must be 3 characters').default('GBP'),
    hiring_type: hiringTypeSchema,
    min_contract_months: z.string().optional(),
    expected_start_date: z.string().optional(),
    notice_period_buyback: z.boolean().default(false),
    no_of_positions: z.coerce.number().int().min(1).max(1000),
    location: z.string().min(1, 'Location is required').max(100),
    work_mode: workModeSchema,
    job_description: z.string().max(10000).optional(),
    required_skills: z.string().min(1, 'At least one required skill is needed'),
    nice_to_have_skills: z.string().optional(),
    priority: jobPrioritySchema.default('medium'),
  })
  .refine((data) => data.max_exp_years >= data.min_exp_years, {
    message: 'Max experience must be greater than or equal to min experience',
    path: ['max_exp_years'],
  });

export type CreateJobOpeningFormValues = z.infer<typeof createJobOpeningFormSchema>;

export const createJobOpeningFormDefaults: CreateJobOpeningFormValues = {
  company_id: '',
  role_id: '',
  status: 'open',
  min_exp_years: 0,
  max_exp_years: 5,
  budget_min: '',
  budget_max: '',
  budget_currency: 'GBP',
  hiring_type: 'permanent',
  min_contract_months: '',
  expected_start_date: '',
  notice_period_buyback: false,
  no_of_positions: 1,
  location: '',
  work_mode: 'hybrid',
  job_description: '',
  required_skills: '',
  nice_to_have_skills: '',
  priority: 'medium',
};

export function toCreateJobOpeningPayload(values: CreateJobOpeningFormValues) {
  const parsed = createJobOpeningFormSchema.parse(values);

  const payload: Record<string, unknown> = {
    company_id: parsed.company_id,
    role_id: parsed.role_id,
    status: parsed.status as JobOpeningStatus,
    min_exp_years: parsed.min_exp_years,
    max_exp_years: parsed.max_exp_years,
    budget_currency: parsed.budget_currency,
    hiring_type: parsed.hiring_type as HiringType,
    notice_period_buyback: parsed.notice_period_buyback,
    no_of_positions: parsed.no_of_positions,
    location: parsed.location,
    work_mode: parsed.work_mode as WorkMode,
    priority: parsed.priority as JobPriority,
    required_skills: parseCommaSeparatedList(parsed.required_skills),
  };

  if (parsed.budget_min) payload.budget_min = Number(parsed.budget_min);
  if (parsed.budget_max) payload.budget_max = Number(parsed.budget_max);
  if (parsed.min_contract_months) {
    payload.min_contract_months = Number(parsed.min_contract_months);
  }
  if (parsed.expected_start_date) {
    payload.expected_start_date = new Date(parsed.expected_start_date).toISOString();
  }
  if (parsed.job_description) payload.job_description = parsed.job_description;

  const niceToHave = parseCommaSeparatedList(parsed.nice_to_have_skills ?? '');
  if (niceToHave.length > 0) payload.nice_to_have_skills = niceToHave;

  return payload;
}
