import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';

interface BillingFormProps {
  onClose: () => void;
}

export const BillingForm: React.FC<BillingFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    application_id: '',
    demand_per_month: '',
    bill_to_customer_gbp_monthly: '',
    margin_per_month_inr: '',
    invoice_ref: '',
    billing_period_start: '',
    billing_period_end: '',
    payment_status: 'pending' as 'pending' | 'invoiced' | 'paid' | 'overdue',
    notes: '',
  });

  // Fetch placed applications
  const { data: applicationsData } = useQuery({
    queryKey: ['applications', 'placed-list'],
    queryFn: async () => {
      const response = await apiClient.get('/applications', { params: { status: 'placed', limit: 100 } });
      return response.data.data || [];
    },
  });

  const applications = applicationsData || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = {
        application_id: formData.application_id,
        demand_per_month: Number(formData.demand_per_month),
        bill_to_customer_gbp_monthly: Number(formData.bill_to_customer_gbp_monthly),
        payment_status: formData.payment_status,
      };

      if (formData.margin_per_month_inr !== '') {
        payload.margin_per_month_inr = Number(formData.margin_per_month_inr);
      }
      if (formData.invoice_ref) {
        payload.invoice_ref = formData.invoice_ref;
      }
      if (formData.billing_period_start) {
        payload.billing_period_start = new Date(formData.billing_period_start).toISOString();
      }
      if (formData.billing_period_end) {
        payload.billing_period_end = new Date(formData.billing_period_end).toISOString();
      }
      if (formData.notes) {
        payload.notes = formData.notes;
      }

      await apiClient.post('/billing', payload);
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardAggregates'] });
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const fieldErrors = Object.entries(err.response.data.errors)
          .map(([field, msgs]: any) => `${field}: ${msgs.join(', ')}`)
          .join(' | ');
        setError(`Validation failed: ${fieldErrors}`);
      } else {
        setError(err.response?.data?.message || 'Failed to create invoice / billing record');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Create Invoice / Billing Record</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-surface-variant/20 rounded-full transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-error-container text-on-error-container rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Placed Allocation / Candidate *</label>
            <select
              required
              value={formData.application_id}
              onChange={e => setFormData({ ...formData, application_id: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              <option value="">Select a placed allocation...</option>
              {applications.map((app: any) => (
                <option key={app.id} value={app.id}>
                  {app.candidate?.full_name} - {app.job_opening?.role?.title} ({app.job_opening?.company?.name})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Demand / Month (Cost) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.demand_per_month}
                onChange={e => setFormData({ ...formData, demand_per_month: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. 3000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Bill to Customer / Month (£) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.bill_to_customer_gbp_monthly}
                onChange={e => setFormData({ ...formData, bill_to_customer_gbp_monthly: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. 4000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Margin / Month (INR)</label>
              <input
                type="number"
                min="0"
                value={formData.margin_per_month_inr}
                onChange={e => setFormData({ ...formData, margin_per_month_inr: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. 85000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Invoice Reference</label>
              <input
                type="text"
                value={formData.invoice_ref}
                onChange={e => setFormData({ ...formData, invoice_ref: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="INV-2026-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Billing Period Start</label>
              <input
                type="date"
                value={formData.billing_period_start}
                onChange={e => setFormData({ ...formData, billing_period_start: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Billing Period End</label>
              <input
                type="date"
                value={formData.billing_period_end}
                onChange={e => setFormData({ ...formData, billing_period_end: e.target.value })}
                className="w-full px-4 py-2 border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Payment Status *</label>
            <select
              value={formData.payment_status}
              onChange={e => setFormData({ ...formData, payment_status: e.target.value as any })}
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
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
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
              disabled={loading}
              className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
