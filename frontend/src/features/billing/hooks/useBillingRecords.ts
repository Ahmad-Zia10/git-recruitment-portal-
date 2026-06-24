import { useQuery } from '@tanstack/react-query';
import { listBillingRecords } from '../../../api/services/billing.service';
import { queryKeys } from '../../../lib/query-keys';
import type { PaginationMeta } from '../../../api/types/api.types';
import type { BillingRecord } from '../../../types/billing.types';

const defaultMeta: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

interface UseBillingRecordsResult {
  records: BillingRecord[];
  meta: PaginationMeta;
  isLoading: boolean;
  isError: boolean;
}

export function useBillingRecords(page: number): UseBillingRecordsResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.billing.list(page),
    queryFn: () => listBillingRecords({ page }),
  });

  return {
    records: data?.data ?? [],
    meta: data?.meta ?? defaultMeta,
    isLoading,
    isError,
  };
}
