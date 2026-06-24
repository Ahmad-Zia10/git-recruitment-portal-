import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJobOpening } from '../../../api/services/job-openings.service';
import { queryKeys } from '../../../lib/query-keys';
import type { CreateJobOpeningFormValues } from '../../../schemas/job-opening.schema';

export function useCreateJobOpening(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateJobOpeningFormValues) => createJobOpening(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobOpenings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      onSuccess?.();
    },
  });
}
