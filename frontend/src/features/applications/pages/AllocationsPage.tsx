import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hasPermission } from '../../../lib/rbac';
import { Pagination } from '../../../components/ui/Pagination';
import { ErrorAlert } from '../../../components/feedback/ErrorAlert';
import { getApiErrorMessage } from '../../../lib/errors';
import type { ApplicationStatus } from '../../../lib/status-machine';
import { toStatusTransitionPayload, type StatusTransitionFormValues } from '../../../schemas/application.schema';
import { useApplications } from '../hooks/useApplications';
import { useUpdateApplicationStatus } from '../hooks/useUpdateApplicationStatus';
import { AllocationsToolbar } from '../components/AllocationsToolbar';
import { AllocationsTable } from '../components/AllocationsTable';
import { AllocationFormModal } from '../components/AllocationFormModal';
import { ApplicationDetailDrawer } from '../components/ApplicationDetailDrawer';
import { StatusTransitionModal } from '../components/StatusTransitionModal';

const STATUSES_REQUIRING_MODAL = new Set<ApplicationStatus>(['rejected', 'offered', 'placed']);

export const AllocationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [prefillCandidateId, setPrefillCandidateId] = useState('');
  const [prefillJobOpeningId, setPrefillJobOpeningId] = useState('');
  const [pendingTransition, setPendingTransition] = useState<{
    id: string;
    status: 'rejected' | 'offered' | 'placed';
  } | null>(null);

  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    const candidateId = searchParams.get('candidateId');
    const jobOpeningId = searchParams.get('jobOpeningId');
    const action = searchParams.get('action');
    if (candidateId || jobOpeningId) {
      setPrefillCandidateId(candidateId ?? '');
      setPrefillJobOpeningId(jobOpeningId ?? '');
      setIsFormOpen(true);
      setSearchParams({}, { replace: true });
    } else if (action === 'create') {
      setIsFormOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { applications, meta, isLoading, isError } = useApplications({ status, page });
  const updateStatus = useUpdateApplicationStatus();

  const submitStatusUpdate = (id: string, input: { status: ApplicationStatus; rejection_reason?: string; offer_date?: string; placed_date?: string }) => {
    setStatusUpdateError('');
    updateStatus.mutate(
      { id, input },
      {
        onSuccess: () => setPendingTransition(null),
        onError: (error) => {
          setStatusUpdateError(getApiErrorMessage(error, 'Failed to update allocation status'));
        },
      }
    );
  };

  const handleStatusChange = (id: string, nextStatus: ApplicationStatus) => {
    if (STATUSES_REQUIRING_MODAL.has(nextStatus)) {
      setPendingTransition({ id, status: nextStatus as 'rejected' | 'offered' | 'placed' });
      return;
    }
    submitStatusUpdate(id, { status: nextStatus });
  };

  const handleTransitionConfirm = (values: StatusTransitionFormValues) => {
    if (!pendingTransition) return;
    const payload = toStatusTransitionPayload(pendingTransition.status, values);
    submitStatusUpdate(pendingTransition.id, payload as { status: ApplicationStatus; rejection_reason?: string; offer_date?: string; placed_date?: string });
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Allocation Board</h2>
          <p className="font-body-md text-on-surface-variant mt-1">
            Manage active candidate allocations and assignment stages.
          </p>
        </div>
        {hasPermission('create_application') && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">post_add</span>
            New Allocation
          </button>
        )}
      </div>

      {statusUpdateError && <ErrorAlert message={statusUpdateError} className="mb-4" />}

      <AllocationsToolbar status={status} onStatusChange={setStatus} showingCount={applications.length} totalCount={meta.total} />

      <AllocationsTable
        applications={applications}
        isLoading={isLoading}
        isError={isError}
        isUpdating={updateStatus.isPending}
        onStatusChange={handleStatusChange}
        onViewDetails={(id) => {
          setSelectedApplicationId(id);
          setIsDetailOpen(true);
        }}
      />

      <Pagination page={page} meta={meta} onPageChange={setPage} />

      {isFormOpen && (
        <AllocationFormModal
          onClose={() => {
            setIsFormOpen(false);
            setPrefillCandidateId('');
            setPrefillJobOpeningId('');
          }}
          initialCandidateId={prefillCandidateId}
          initialJobOpeningId={prefillJobOpeningId}
        />
      )}

      <ApplicationDetailDrawer
        applicationId={selectedApplicationId}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {pendingTransition && (
        <StatusTransitionModal
          targetStatus={pendingTransition.status}
          isPending={updateStatus.isPending}
          onClose={() => setPendingTransition(null)}
          onConfirm={handleTransitionConfirm}
        />
      )}
    </div>
  );
};
