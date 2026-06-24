import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApplication } from '../../../api/services/applications.service';
import { queryKeys } from '../../../lib/query-keys';
import type { CreateApplicationFormValues } from '../../../schemas/application.schema';

export function useCreateApplication(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateApplicationFormValues) => createApplication(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      onSuccess?.();
    },
  });
}
