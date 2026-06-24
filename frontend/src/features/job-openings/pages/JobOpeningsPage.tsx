import React, { useEffect, useState } from 'react';
import { hasPermission } from '../../../lib/rbac';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';
import { Pagination } from '../../../components/ui/Pagination';
import { useJobOpenings } from '../hooks/useJobOpenings';
import { JobOpeningsToolbar } from '../components/JobOpeningsToolbar';
import { JobOpeningsTable } from '../components/JobOpeningsTable';
import { JobOpeningFormModal } from '../components/JobOpeningFormModal';

export const JobOpeningsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [hiringType, setHiringType] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, hiringType]);

  const { jobs, meta, isLoading, isError } = useJobOpenings({
    search: debouncedSearch,
    status,
    hiringType,
    page,
  });

  return (
    <div className="flex flex-col h-full w-full max-w-full min-w-0 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Requirements</h2>
          <p className="font-body-md text-on-surface-variant">
            Manage and track candidate requirements for all enterprise clients.
          </p>
        </div>

        {hasPermission('create_job') && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            Add Requirement
          </button>
        )}
      </div>

      <JobOpeningsToolbar
        search={search}
        status={status}
        hiringType={hiringType}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onHiringTypeChange={setHiringType}
      />

      <JobOpeningsTable
        jobs={jobs}
        page={page}
        pageSize={meta.limit}
        isLoading={isLoading}
        isError={isError}
      />

      <Pagination page={page} meta={meta} onPageChange={setPage} />

      {isFormOpen && <JobOpeningFormModal onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};
