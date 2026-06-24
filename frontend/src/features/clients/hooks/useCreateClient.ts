import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCompany } from '../../../api/services/companies.service';
import { queryKeys } from '../../../lib/query-keys';
import type { CreateCompanyFormValues } from '../../../schemas/company.schema';

export function useCreateClient(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateCompanyFormValues) => createCompany(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      onSuccess?.();
    },
  });
}
