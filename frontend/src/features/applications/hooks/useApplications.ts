import { useQuery } from '@tanstack/react-query';
import { listApplications } from '../../../api/services/applications.service';
import { queryKeys } from '../../../lib/query-keys';
import type { PaginationMeta } from '../../../api/types/api.types';
import type { Application } from '../../../types/application.types';
import type { ApplicationStatus } from '../../../lib/status-machine';

const defaultMeta: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

interface UseApplicationsFilters {
  status: string;
  page: number;
}

interface UseApplicationsResult {
  applications: Application[];
  meta: PaginationMeta;
  isLoading: boolean;
  isError: boolean;
}

export function useApplications(filters: UseApplicationsFilters): UseApplicationsResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.applications.list(filters),
    queryFn: () =>
      listApplications({
        status: filters.status ? (filters.status as ApplicationStatus) : undefined,
        page: filters.page,
      }),
  });

  return {
    applications: data?.data ?? [],
    meta: data?.meta ?? defaultMeta,
    isLoading,
    isError,
  };
}
