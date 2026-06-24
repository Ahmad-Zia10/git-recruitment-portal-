import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCompany } from '../../../api/services/companies.service';
import { queryKeys } from '../../../lib/query-keys';
import type { CreateCompanyFormValues } from '../../../schemas/company.schema';

export function useUpdateClient(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: CreateCompanyFormValues }) =>
      updateCompany(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      onSuccess?.();
    },
  });
}
