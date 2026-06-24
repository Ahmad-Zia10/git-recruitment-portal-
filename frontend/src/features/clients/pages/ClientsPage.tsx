import React, { useEffect, useState } from 'react';
import { hasPermission } from '../../../lib/rbac';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';
import { Pagination } from '../../../components/ui/Pagination';
import { useClients } from '../hooks/useClients';
import { ClientsToolbar } from '../components/ClientsToolbar';
import { ClientsTable } from '../components/ClientsTable';
import { ClientFormModal } from '../components/ClientFormModal';

export const ClientsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { clients, meta, isLoading, isError } = useClients(debouncedSearch, page);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Clients</h2>
          <p className="font-body-md text-on-surface-variant mt-1">
            Manage your enterprise partners and subsidiaries.
          </p>
        </div>
        {hasPermission('create_company') && (
          <button
            type="button"
            className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
            onClick={() => setIsFormOpen(true)}
          >
            <span className="material-symbols-outlined">domain_add</span>
            Add Client
          </button>
        )}
      </div>

      <ClientsToolbar
        search={search}
        onSearchChange={setSearch}
        showingCount={clients.length}
        totalCount={meta.total}
      />

      <ClientsTable clients={clients} isLoading={isLoading} isError={isError} />

      <Pagination page={page} meta={meta} onPageChange={setPage} />

      {isFormOpen && <ClientFormModal onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};
