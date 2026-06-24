/** Mirrors backend shared/utils/status-machine.ts */
export type ApplicationStatus =
  | 'shortlisted'
  | 'screening'
  | 'interviewing'
  | 'offered'
  | 'placed'
  | 'rejected'
  | 'withdrawn';

const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  shortlisted: ['screening', 'rejected', 'withdrawn'],
  screening: ['shortlisted', 'interviewing', 'rejected', 'withdrawn'],
  interviewing: ['offered', 'rejected', 'withdrawn'],
  offered: ['placed', 'rejected', 'withdrawn'],
  placed: [],
  rejected: [],
  withdrawn: [],
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  shortlisted: 'Shortlisted',
  screening: 'Screening',
  interviewing: 'Interviewing',
  offered: 'Offered',
  placed: 'Placed',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export const ALL_APPLICATION_STATUSES: ApplicationStatus[] = [
  'shortlisted',
  'screening',
  'interviewing',
  'offered',
  'placed',
  'rejected',
  'withdrawn',
];

export function getAllowedNextStatuses(current: ApplicationStatus): ApplicationStatus[] {
  return TRANSITIONS[current] ?? [];
}

/** Statuses shown in the row dropdown: current + valid next steps. */
export function getSelectableStatuses(current: ApplicationStatus): ApplicationStatus[] {
  const next = getAllowedNextStatuses(current);
  if (next.length === 0) return [current];
  return [current, ...next];
}

export function canTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  if (from === to) return true;
  return getAllowedNextStatuses(from).includes(to);
}
