import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBillingRecord } from '../../../api/services/billing.service';
import { queryKeys } from '../../../lib/query-keys';
import type { CreateBillingFormInput } from '../../../schemas/billing.schema';

export function useCreateBillingRecord(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateBillingFormInput) => createBillingRecord(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      onSuccess?.();
    },
  });
}
