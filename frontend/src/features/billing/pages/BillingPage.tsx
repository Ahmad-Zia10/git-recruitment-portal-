import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hasPermission } from '../../../lib/rbac';
import { Pagination } from '../../../components/ui/Pagination';
import { useBillingRecords } from '../hooks/useBillingRecords';
import { BillingTable } from '../components/BillingTable';
import { BillingFormModal } from '../components/BillingFormModal';
import { BillingEditModal } from '../components/BillingEditModal';
import type { BillingRecord } from '../../../types/billing.types';

export const BillingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BillingRecord | null>(null);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setIsFormOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { records, meta, isLoading, isError } = useBillingRecords(page);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Billing & Finance</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Track financial records and allocation invoicing.</p>
        </div>
        {hasPermission('create_billing') && (
          <button type="button" onClick={() => setIsFormOpen(true)} className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
            <span className="material-symbols-outlined">receipt_long</span>
            Create Invoice
          </button>
        )}
      </div>

      <BillingTable records={records} isLoading={isLoading} isError={isError} onEdit={setEditingRecord} />
      <Pagination page={page} meta={meta} onPageChange={setPage} />
      {isFormOpen && <BillingFormModal onClose={() => setIsFormOpen(false)} />}
      {editingRecord && <BillingEditModal record={editingRecord} onClose={() => setEditingRecord(null)} />}
    </div>
  );
};
