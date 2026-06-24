import { useQuery } from '@tanstack/react-query';
import { listApplications } from '../../../api/services/applications.service';
import { queryKeys } from '../../../lib/query-keys';
import type { Application } from '../../../types/application.types';

export function usePlacedApplications() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.applications.placedList(),
    queryFn: () => listApplications({ status: 'placed', limit: 100 }),
  });

  return {
    applications: (data?.data ?? []) as Application[],
    isLoading,
  };
}
