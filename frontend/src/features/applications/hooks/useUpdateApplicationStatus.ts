import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApplicationStatus } from '../../../api/services/applications.service';
import { queryKeys } from '../../../lib/query-keys';
import type { ApplicationStatus } from '../../../lib/status-machine';

interface UpdateStatusVariables {
  id: string;
  status: ApplicationStatus;
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateStatusVariables) =>
      updateApplicationStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}
