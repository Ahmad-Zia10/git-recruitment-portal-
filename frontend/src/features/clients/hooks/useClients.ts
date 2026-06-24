import { useQuery } from '@tanstack/react-query';
import { listCompanies } from '../../../api/services/companies.service';
import { queryKeys } from '../../../lib/query-keys';
import type { PaginationMeta } from '../../../api/types/api.types';
import type { Company } from '../../../types/company.types';

const defaultMeta: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

interface UseClientsResult {
  clients: Company[];
  meta: PaginationMeta;
  isLoading: boolean;
  isError: boolean;
}

export function useClients(search: string, page: number): UseClientsResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.clients.list(search, page),
    queryFn: () => listCompanies({ search: search || undefined, page }),
  });

  return {
    clients: data?.data ?? [],
    meta: data?.meta ?? defaultMeta,
    isLoading,
    isError,
  };
}
