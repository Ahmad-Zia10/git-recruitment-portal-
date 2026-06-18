import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { hasPermission } from '../../utils/rbac';

export const Billing: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['billing', page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      
      const response = await apiClient.get('/billing', { params });
      return response.data.data;
    },
  });

  const records = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Billing & Finance</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Track financial records and allocation invoicing.</p>
        </div>
        {hasPermission('create_billing') && (
          <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
            <span className="material-symbols-outlined">receipt_long</span>
            Create Invoice
          </button>
        )}
      </div>

      <section className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low/30">
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Invoice Ref</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Application/Allocation</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Amount (Monthly)</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Billing Period</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">Loading records...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-error">Failed to load billing records</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td className="py-32" colSpan={5}>
                    <div className="flex flex-col items-center justify-center text-center opacity-60">
                      <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-display-lg" style={{ fontSize: '48px' }}>receipt_long</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No billing records found</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((record: any) => (
                  <tr key={record.id} className="border-b border-outline-variant/50 hover:bg-surface-variant/5">
                    <td className="px-6 py-4 font-body-md font-semibold text-on-surface">{record.invoice_ref}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{record.application_id}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface">£{record.bill_to_customer_gbp_monthly}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface">
                      {new Date(record.billing_period_start).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${record.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {record.payment_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Footer Pagination */}
      <div className="mt-6 flex items-center justify-between text-body-sm text-on-surface-variant">
        <div>Showing {meta.total === 0 ? 0 : (page - 1) * meta.limit + 1} to {Math.min(page * meta.limit, meta.total)} of {meta.total} entries</div>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="px-3 py-1 border border-primary bg-primary/10 text-primary rounded-lg font-bold">{page}</button>
          <button 
            className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= meta.totalPages}
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
