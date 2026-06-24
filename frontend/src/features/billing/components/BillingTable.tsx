import React from 'react';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { hasPermission } from '../../../lib/rbac';
import type { BillingRecord } from '../../../types/billing.types';

interface BillingTableProps {
  records: BillingRecord[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (record: BillingRecord) => void;
}

function formatAllocationLabel(record: BillingRecord) {
  const app = record.application;
  if (!app) return record.application_id;

  const candidate = app.candidate?.full_name ?? 'Unknown candidate';
  const role = app.job_opening?.role?.title ?? 'Unknown role';
  const company = app.job_opening?.company?.name ?? 'Unknown company';
  return `${candidate} — ${role} (${company})`;
}

function paymentStatusClass(status: BillingRecord['payment_status']) {
  return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
}

export const BillingTable: React.FC<BillingTableProps> = ({ records, isLoading, isError, onEdit }) => (
  <section className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col min-h-[400px]">
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container-low/30">
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Invoice Ref
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Application/Allocation
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Amount (Monthly)
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Billing Period
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6}>
                <LoadingState />
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-error">
                Failed to load billing records
              </td>
            </tr>
          ) : records.length === 0 ? (
            <tr>
              <td className="py-32" colSpan={6}>
                <div className="flex flex-col items-center justify-center text-center opacity-60">
                  <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                    <span
                      className="material-symbols-outlined text-display-lg"
                      style={{ fontSize: '48px' }}
                    >
                      receipt_long
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                    No billing records found
                  </h3>
                </div>
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-outline-variant/50 hover:bg-surface-variant/5"
              >
                <td className="px-6 py-4 font-body-md font-semibold text-on-surface">
                  {record.invoice_ref ?? '—'}
                </td>
                <td className="px-6 py-4 font-body-md text-on-surface">
                  {formatAllocationLabel(record)}
                </td>
                <td className="px-6 py-4 font-body-md text-on-surface">
                  £{record.bill_to_customer_gbp_monthly}
                </td>
                <td className="px-6 py-4 font-body-md text-on-surface">
                  {record.billing_period_start
                    ? new Date(record.billing_period_start).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${paymentStatusClass(record.payment_status)}`}
                  >
                    {record.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {hasPermission('edit_billing') && (
                    <button type="button" onClick={() => onEdit(record)} className="text-primary text-sm font-semibold hover:underline">
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);
