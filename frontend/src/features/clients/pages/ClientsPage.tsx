import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hasPermission } from '../../../lib/rbac';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';
import { Pagination } from '../../../components/ui/Pagination';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { getApiErrorMessage } from '../../../lib/errors';
import { useClients } from '../hooks/useClients';
import { useDeleteClient } from '../hooks/useDeleteClient';
import { ClientsToolbar } from '../components/ClientsToolbar';
import { ClientsTable } from '../components/ClientsTable';
import { ClientFormModal } from '../components/ClientFormModal';
import type { Company } from '../../../types/company.types';

export const ClientsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Company | null>(null);
  const [deletingClient, setDeletingClient] = useState<Company | null>(null);

  const debouncedSearch = useDebouncedValue(search);
  const deleteClient = useDeleteClient(() => setDeletingClient(null));

  useEffect(() => setPage(1), [debouncedSearch]);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setIsFormOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { clients, meta, isLoading, isError } = useClients(debouncedSearch, page);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Clients</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Manage your enterprise partners and subsidiaries.</p>
        </div>
        {hasPermission('create_company') && (
          <button type="button" onClick={() => setIsFormOpen(true)} className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
            <span className="material-symbols-outlined">domain_add</span>
            Add Client
          </button>
        )}
      </div>

      <ClientsToolbar search={search} onSearchChange={setSearch} showingCount={clients.length} totalCount={meta.total} />
      <ClientsTable clients={clients} isLoading={isLoading} isError={isError} onEdit={(c) => { setEditingClient(c); setIsFormOpen(true); }} onDelete={setDeletingClient} />
      <Pagination page={page} meta={meta} onPageChange={setPage} />

      {isFormOpen && <ClientFormModal onClose={closeForm} client={editingClient ?? undefined} />}

      {deletingClient && (
        <ConfirmDialog
          title="Delete Client"
          message={
            deleteClient.isError
              ? getApiErrorMessage(deleteClient.error, 'Failed to delete client. It may have linked requirements.')
              : `Are you sure you want to delete "${deletingClient.name}"? This cannot be undone.`
          }
          confirmLabel="Delete"
          isPending={deleteClient.isPending}
          onCancel={() => { setDeletingClient(null); deleteClient.reset(); }}
          onConfirm={() => deleteClient.mutate(deletingClient.id)}
        />
      )}
    </div>
  );
};
