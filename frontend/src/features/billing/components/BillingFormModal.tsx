import React, { useState } from 'react';
import {
  createBillingFormDefaults,
  createBillingFormInputSchema,
  type CreateBillingFormInput,
} from '../../../schemas/billing.schema';
import { useCreateBillingRecord } from '../hooks/useCreateBillingRecord';
import { usePlacedApplications } from '../hooks/usePlacedApplications';
import { getValidationErrorMessage } from '../../../lib/errors';
import { ErrorAlert } from '../../../components/feedback/ErrorAlert';

interface BillingFormModalProps {
  onClose: () => void;
}

export const BillingFormModal: React.FC<BillingFormModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<CreateBillingFormInput>(createBillingFormDefaults);
  const [validationError, setValidationError] = useState('');

  const { applications, isLoading: optionsLoading } = usePlacedApplications();
  const createBilling = useCreateBillingRecord(onClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const parsed = createBillingFormInputSchema.safeParse(formData);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Invalid form data');
      return;
    }

    createBilling.mutate(parsed.data);
  };

  const errorMessage =
    validationError ||
    (createBilling.isError
      ? getValidationErrorMessage(createBilling.error, 'Failed to create invoice / billing record')
      : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Create Invoice / Billing Record
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-surface-variant/20 rounded-full transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <ErrorAlert message={errorMessage} />

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Placed Allocation / Candidate *
            </label>
            <select
              required
              value={formData.application_id}
              onChange={(e) => setFormData({ ...formData, application_id: e.target.value })}
              disabled={optionsLoading}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white disabled:opacity-60"
            >
              <option value="">Select a placed allocation...</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.candidate?.full_name} - {app.job_opening?.role?.title} (
                  {app.job_opening?.company?.name})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Demand / Month (Cost) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.demand_per_month}
                onChange={(e) => setFormData({ ...formData, demand_per_month: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. 3000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Bill to Customer / Month (£) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.bill_to_customer_gbp_monthly}
                onChange={(e) =>
                  setFormData({ ...formData, bill_to_customer_gbp_monthly: e.target.value })
                }
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. 4000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Margin / Month (INR)
              </label>
              <input
                type="number"
                min="0"
                value={formData.margin_per_month_inr ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, margin_per_month_inr: e.target.value })
                }
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. 85000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Invoice Reference
              </label>
              <input
                type="text"
                value={formData.invoice_ref ?? ''}
                onChange={(e) => setFormData({ ...formData, invoice_ref: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="INV-2026-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Billing Period Start
              </label>
              <input
                type="date"
                value={formData.billing_period_start ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, billing_period_start: e.target.value })
                }
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Billing Period End
              </label>
              <input
                type="date"
                value={formData.billing_period_end ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, billing_period_end: e.target.value })
                }
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Payment Status *
            </label>
            <select
              value={formData.payment_status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  payment_status: e.target.value as CreateBillingFormInput['payment_status'],
                })
              }
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              <option value="pending">Pending</option>
              <option value="invoiced">Invoiced</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Notes</label>
            <textarea
              value={formData.notes ?? ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none h-24 resize-none"
              placeholder="Add details about payment terms, billing notes..."
            />
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-on-surface-variant font-semibold hover:bg-surface-variant/10 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createBilling.isPending || optionsLoading}
              className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {createBilling.isPending ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
