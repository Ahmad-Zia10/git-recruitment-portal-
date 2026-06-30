import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCompany } from '../../../api/services/companies.service';
import { queryKeys } from '../../../lib/query-keys';

export function useDeleteClient(onSuccess?: (data: { success: boolean; message: string; softDeleted: boolean }) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      onSuccess?.(data);
    },
  });
}
