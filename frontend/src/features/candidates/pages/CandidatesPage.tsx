import React, { useEffect, useState } from 'react';
import { hasPermission } from '../../../lib/rbac';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';
import { Pagination } from '../../../components/ui/Pagination';
import { useCandidates } from '../hooks/useCandidates';
import { CandidatesToolbar } from '../components/CandidatesToolbar';
import { CandidatesTable } from '../components/CandidatesTable';
import { CandidateFormModal } from '../components/CandidateFormModal';
import { CandidateDrawer } from '../components/CandidateDrawer';
import type { Candidate } from '../../../types/candidate.types';

export const CandidatesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const { candidates, meta, isLoading, isError } = useCandidates({
    search: debouncedSearch,
    status,
    page,
  });

  const handleRowClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDrawerOpen(true);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Candidates</h2>
          <nav className="flex text-on-surface-variant font-label-md text-label-md mt-1">
            <span className="hover:text-primary cursor-pointer">Candidate Management</span>
            <span className="mx-2">/</span>
            <span>Active Bench</span>
          </nav>
        </div>
        {hasPermission('create_candidate') && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined">person_add</span>
            Add Candidate
          </button>
        )}
      </div>

      <CandidatesToolbar
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        showingCount={candidates.length}
        totalCount={meta.total}
      />

      <CandidatesTable
        candidates={candidates}
        isLoading={isLoading}
        isError={isError}
        onClearFilters={handleClearFilters}
        onRowClick={handleRowClick}
      />

      <Pagination page={page} meta={meta} onPageChange={setPage} />

      <CandidateDrawer
        candidate={selectedCandidate}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {isFormOpen && <CandidateFormModal onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};
