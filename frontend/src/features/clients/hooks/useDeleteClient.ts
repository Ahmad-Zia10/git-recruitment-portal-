import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCompany } from '../../../api/services/companies.service';
import { queryKeys } from '../../../lib/query-keys';

export function useDeleteClient(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      onSuccess?.();
    },
  });
}
