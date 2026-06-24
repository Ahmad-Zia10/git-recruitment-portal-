import { useQuery } from '@tanstack/react-query';
import { listJobOpenings } from '../../../api/services/job-openings.service';
import { listCandidates } from '../../../api/services/candidates.service';
import { queryKeys } from '../../../lib/query-keys';
import type { JobOpening } from '../../../types/job-opening.types';
import type { Candidate } from '../../../types/candidate.types';

interface UseAllocationOptionsResult {
  jobs: JobOpening[];
  candidates: Candidate[];
  isLoading: boolean;
}

export function useAllocationOptions(): UseAllocationOptionsResult {
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: queryKeys.jobOpenings.openList(),
    queryFn: () => listJobOpenings({ status: 'open', limit: 100 }),
  });

  const { data: candidatesData, isLoading: candidatesLoading } = useQuery({
    queryKey: queryKeys.candidates.activeList(),
    queryFn: () => listCandidates({ status: 'active', limit: 100 }),
  });

  return {
    jobs: jobsData?.data ?? [],
    candidates: candidatesData?.data ?? [],
    isLoading: jobsLoading || candidatesLoading,
  };
}
