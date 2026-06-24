import { useQuery } from '@tanstack/react-query';
import { getSuggestedCandidates } from '../../../api/services/job-openings.service';
import { queryKeys } from '../../../lib/query-keys';

export function useSuggestedCandidates(jobOpeningId: string | null) {
  return useQuery({
    queryKey: queryKeys.jobOpenings.suggested(jobOpeningId ?? ''),
    queryFn: () => getSuggestedCandidates(jobOpeningId!, 1, 10),
    enabled: Boolean(jobOpeningId),
  });
}
