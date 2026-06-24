import React, { useState } from 'react';
import { updateBillingFormInputSchema, type UpdateBillingFormInput } from '../../../schemas/billing.schema';
import { useUpdateBillingRecord } from '../hooks/useUpdateBillingRecord';
import { ErrorAlert } from '../../../components/feedback/ErrorAlert';
import { getValidationErrorMessage } from '../../../lib/errors';
import type { BillingRecord } from '../../../types/billing.types';

interface BillingEditModalProps {
  record: BillingRecord;
  onClose: () => void;
}

export const BillingEditModal: React.FC<BillingEditModalProps> = ({ record, onClose }) => {
  const [formData, setFormData] = useState<UpdateBillingFormInput>({
    payment_status: record.payment_status,
    invoice_ref: record.invoice_ref ?? '',
    notes: record.notes ?? '',
  });
  const [validationError, setValidationError] = useState('');
  const updateBilling = useUpdateBillingRecord(onClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = updateBillingFormInputSchema.safeParse(formData);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Invalid form data');
      return;
    }
    updateBilling.mutate({ id: record.id, values: parsed.data });
  };

  const apiError = updateBilling.isError
    ? getValidationErrorMessage(updateBilling.error, 'Failed to update invoice')
    : '';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-outline-variant flex justify-between">
          <h2 className="font-headline-sm">Edit Invoice</h2>
          <button type="button" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <ErrorAlert message={validationError || apiError} />
          <div>
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <select value={formData.payment_status} onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as UpdateBillingFormInput['payment_status'] })} className="w-full px-3 py-2 border border-outline-variant rounded-md bg-white">
              <option value="pending">Pending</option>
              <option value="invoiced">Invoiced</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Invoice Ref</label>
            <input type="text" value={formData.invoice_ref ?? ''} onChange={(e) => setFormData({ ...formData, invoice_ref: e.target.value })} className="w-full px-3 py-2 border border-outline-variant rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={formData.notes ?? ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 border border-outline-variant rounded-md h-20 resize-none" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-on-surface-variant">Cancel</button>
            <button type="submit" disabled={updateBilling.isPending} className="px-6 py-2 bg-primary text-white rounded-md disabled:opacity-50">{updateBilling.isPending ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
