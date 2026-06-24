import { useQuery } from '@tanstack/react-query';
import { listJobOpenings } from '../../../api/services/job-openings.service';
import { queryKeys } from '../../../lib/query-keys';
import type { PaginationMeta } from '../../../api/types/api.types';
import type { JobOpening, JobOpeningListFilters } from '../../../types/job-opening.types';
import type { HiringType, JobOpeningStatus } from '../../../types/job-opening.types';

const defaultMeta: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

interface UseJobOpeningsResult {
  jobs: JobOpening[];
  meta: PaginationMeta;
  isLoading: boolean;
  isError: boolean;
}

export function useJobOpenings(filters: JobOpeningListFilters): UseJobOpeningsResult {
  const { search, status, hiringType, page } = filters;

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.jobOpenings.list({ search, status, hiringType, page }),
    queryFn: () =>
      listJobOpenings({
        search: search || undefined,
        status: (status || undefined) as JobOpeningStatus | undefined,
        hiring_type: (hiringType || undefined) as HiringType | undefined,
        page,
      }),
  });

  return {
    jobs: data?.data ?? [],
    meta: data?.meta ?? defaultMeta,
    isLoading,
    isError,
  };
}
