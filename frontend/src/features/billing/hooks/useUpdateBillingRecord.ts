import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBillingRecord } from '../../../api/services/billing.service';
import { queryKeys } from '../../../lib/query-keys';
import type { UpdateBillingFormInput } from '../../../schemas/billing.schema';

export function useUpdateBillingRecord(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdateBillingFormInput }) =>
      updateBillingRecord(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.all });
      onSuccess?.();
    },
  });
}
