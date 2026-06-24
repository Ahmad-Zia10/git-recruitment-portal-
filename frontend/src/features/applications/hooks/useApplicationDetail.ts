import { useQuery } from '@tanstack/react-query';
import { getApplicationById } from '../../../api/services/applications.service';
import { queryKeys } from '../../../lib/query-keys';

export function useApplicationDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.applications.detail(id ?? ''),
    queryFn: () => getApplicationById(id!),
    enabled: Boolean(id),
  });
}
