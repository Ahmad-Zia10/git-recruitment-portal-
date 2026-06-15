import { ValidationError } from '../errors'

export type ApplicationStatus =
  | 'shortlisted'
  | 'screening'
  | 'interviewing'
  | 'offered'
  | 'placed'
  | 'rejected'
  | 'withdrawn'

const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  shortlisted:  ['screening', 'rejected', 'withdrawn'],
  screening:    ['shortlisted', 'interviewing', 'rejected', 'withdrawn'],
  interviewing: ['offered', 'rejected', 'withdrawn'],
  offered:      ['placed', 'rejected', 'withdrawn'],
  placed:       [],
  rejected:     [],
  withdrawn:    [],
}

export function validateStatusTransition(
  current: ApplicationStatus,
  next: ApplicationStatus
): void {
  const allowed = TRANSITIONS[current]

  if (!allowed) {
    throw new ValidationError(`Unknown status: ${current}`)
  }

  if (allowed.length === 0) {
    throw new ValidationError(
      `Application is ${current}. No further status changes are allowed.`
    )
  }

  if (!allowed.includes(next)) {
    throw new ValidationError(
      `Cannot transition from '${current}' to '${next}'. Allowed transitions: ${allowed.join(', ')}`
    )
  }
}