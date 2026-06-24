import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApplicationStatus } from '../../../api/services/applications.service';
import { queryKeys } from '../../../lib/query-keys';
import type { ApplicationStatus } from '../../../lib/status-machine';
import type { UpdateApplicationStatusInput } from '../../../types/application.types';

interface UpdateStatusVariables {
  id: string;
  input: UpdateApplicationStatusInput;
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdateStatusVariables) => updateApplicationStatus(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}

export type { ApplicationStatus };
