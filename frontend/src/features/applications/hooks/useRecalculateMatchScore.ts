import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recalculateMatchScore } from '../../../api/services/applications.service';
import { queryKeys } from '../../../lib/query-keys';

export function useRecalculateMatchScore(applicationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => recalculateMatchScore(applicationId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}
