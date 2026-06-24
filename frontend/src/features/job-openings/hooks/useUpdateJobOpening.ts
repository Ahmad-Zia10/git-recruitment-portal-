import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateJobOpening } from '../../../api/services/job-openings.service';
import { queryKeys } from '../../../lib/query-keys';
import type { CreateJobOpeningFormValues } from '../../../schemas/job-opening.schema';

export function useUpdateJobOpening(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: CreateJobOpeningFormValues }) =>
      updateJobOpening(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobOpenings.all });
      onSuccess?.();
    },
  });
}
