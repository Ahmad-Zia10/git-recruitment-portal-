import React, { useEffect, useState } from 'react';
import { hasPermission } from '../../../lib/rbac';
import { Pagination } from '../../../components/ui/Pagination';
import { ErrorAlert } from '../../../components/feedback/ErrorAlert';
import { getApiErrorMessage } from '../../../lib/errors';
import type { ApplicationStatus } from '../../../lib/status-machine';
import { useApplications } from '../hooks/useApplications';
import { useUpdateApplicationStatus } from '../hooks/useUpdateApplicationStatus';
import { AllocationsToolbar } from '../components/AllocationsToolbar';
import { AllocationsTable } from '../components/AllocationsTable';
import { AllocationFormModal } from '../components/AllocationFormModal';

export const AllocationsPage: React.FC = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [status]);

  const { applications, meta, isLoading, isError } = useApplications({ status, page });
  const updateStatus = useUpdateApplicationStatus();

  const handleStatusChange = (id: string, nextStatus: ApplicationStatus) => {
    setStatusUpdateError('');
    updateStatus.mutate(
      { id, status: nextStatus },
      {
        onError: (error) => {
          setStatusUpdateError(getApiErrorMessage(error, 'Failed to update allocation status'));
        },
      }
    );
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

      <AllocationsToolbar
        status={status}
        onStatusChange={setStatus}
        showingCount={applications.length}
        totalCount={meta.total}
      />

      <AllocationsTable
        applications={applications}
        isLoading={isLoading}
        isError={isError}
        isUpdating={updateStatus.isPending}
        onStatusChange={handleStatusChange}
      />

      <Pagination page={page} meta={meta} onPageChange={setPage} />

      {isFormOpen && <AllocationFormModal onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};
