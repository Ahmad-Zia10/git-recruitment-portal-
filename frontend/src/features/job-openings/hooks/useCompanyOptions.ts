import { useQuery } from '@tanstack/react-query';
import { listCompanies } from '../../../api/services/companies.service';
import { queryKeys } from '../../../lib/query-keys';

export function useCompanyOptions() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.companies.activeList(),
    queryFn: () => listCompanies({ limit: 100 }),
  });

  return {
    companies: data?.data ?? [],
    isLoading,
  };
}
