import { useQuery } from '@tanstack/react-query';
import { getJobOpeningById } from '../../../api/services/job-openings.service';
import { queryKeys } from '../../../lib/query-keys';

export function useJobOpeningDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.jobOpenings.detail(id ?? ''),
    queryFn: () => getJobOpeningById(id!),
    enabled: Boolean(id),
  });
}
