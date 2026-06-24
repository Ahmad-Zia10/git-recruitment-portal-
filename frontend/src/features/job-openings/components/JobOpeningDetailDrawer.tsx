import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { hasPermission } from '../../../lib/rbac';
import { formatBudget, formatDate, formatUnderscoreLabel } from '../../../lib/formatters';
import { useJobOpeningDetail } from '../hooks/useJobOpeningDetail';
import { useSuggestedCandidates } from '../hooks/useSuggestedCandidates';

interface JobOpeningDetailDrawerProps {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobOpeningDetailDrawer: React.FC<JobOpeningDetailDrawerProps> = ({
  jobId,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { data: job, isLoading, isError } = useJobOpeningDetail(jobId);
  const { data: suggested, isLoading: suggestedLoading } = useSuggestedCandidates(jobId);

  if (!isOpen || !jobId) return null;

  const handleAllocate = (candidateId: string) => {
    onClose();
    navigate(`/allocations?candidateId=${candidateId}&jobOpeningId=${jobId}`);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" onClick={onClose} role="presentation" />
      <aside className="fixed right-0 top-0 h-screen w-full sm:w-[640px] bg-white shadow-2xl z-[70] flex flex-col border-l border-outline-variant">
        <div className="p-6 border-b border-outline-variant flex justify-between items-start">
          <div>
            <h3 className="font-headline-md text-headline-md">
              {job?.role?.title ?? 'Requirement Details'}
            </h3>
            <p className="font-body-sm text-on-surface-variant mt-1">
              {job?.company?.name ?? 'Loading...'}
            </p>
          </div>
          <button
            type="button"
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {isLoading ? (
            <LoadingState />
          ) : isError || !job ? (
            <p className="text-error text-center py-8">Failed to load requirement details.</p>
          ) : (
            <>
              <section className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-on-surface-variant block text-xs uppercase tracking-wide">Status</span>
                  <span className="font-semibold capitalize">{formatUnderscoreLabel(job.status)}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs uppercase tracking-wide">Priority</span>
                  <span className="font-semibold capitalize">{job.priority}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs uppercase tracking-wide">Location</span>
                  <span>{job.location} ({formatUnderscoreLabel(job.work_mode)})</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs uppercase tracking-wide">Hiring Type</span>
                  <span className="capitalize">{formatUnderscoreLabel(job.hiring_type)}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs uppercase tracking-wide">Experience</span>
                  <span>{job.min_exp_years}–{job.max_exp_years} yrs</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs uppercase tracking-wide">Budget</span>
                  <span>{formatBudget(job.budget_min, job.budget_max, job.budget_currency)}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs uppercase tracking-wide">Positions</span>
                  <span>{job.no_of_positions}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs uppercase tracking-wide">Start Date</span>
                  <span>{formatDate(job.expected_start_date)}</span>
                </div>
              </section>

              {job.required_skills.length > 0 && (
                <section>
                  <h4 className="font-bold text-on-surface mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {job.job_description && (
                <section>
                  <h4 className="font-bold text-on-surface mb-2">Description</h4>
                  <p className="text-sm text-on-surface-variant whitespace-pre-wrap">{job.job_description}</p>
                </section>
              )}

              <section>
                <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">person_search</span>
                  Suggested Candidates
                </h4>
                {suggestedLoading ? (
                  <LoadingState />
                ) : !suggested?.data?.length ? (
                  <p className="text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-4">
                    No matching candidates found for this requirement.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {suggested.data.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="border border-outline-variant rounded-lg p-4 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-semibold text-on-surface">{candidate.full_name}</div>
                          <div className="text-xs text-on-surface-variant">
                            {candidate.current_role || 'No role'} · {candidate.exp_years} yrs ·{' '}
                            {candidate.match_score}% match
                          </div>
                          {candidate.primary_skills && candidate.primary_skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.primary_skills.slice(0, 3).map((s) => (
                                <span
                                  key={s.skill}
                                  className="text-[10px] px-2 py-0.5 bg-surface-container-low rounded-full"
                                >
                                  {s.skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {hasPermission('create_application') && (
                          <button
                            type="button"
                            onClick={() => handleAllocate(candidate.id)}
                            className="shrink-0 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:opacity-90"
                          >
                            Allocate
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
