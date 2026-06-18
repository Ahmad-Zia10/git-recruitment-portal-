import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { hasPermission } from '../../utils/rbac';
import { ClientForm } from './ClientForm';

export const Clients: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['clients', search, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', page.toString());
      
      const response = await apiClient.get('/companies', { params });
      return response.data;
    },
  });

  const clients = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Clients</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Manage your enterprise partners and subsidiaries.</p>
        </div>
        {hasPermission('create_company') && (
          <button 
            className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
            onClick={() => setIsFormOpen(true)}
          >
            <span className="material-symbols-outlined">domain_add</span>
            Add Client
          </button>
        )}
      </div>

      <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[300px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary transition-all text-body-md" 
            placeholder="Search clients..." 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ml-auto flex items-center gap-2 text-on-surface-variant text-sm">
          Showing {clients.length} of {meta.total}
        </div>
      </section>

      <section className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low/30">
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Industry</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Contact</th>
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
                  <td colSpan={5} className="p-8 text-center text-error">Failed to load clients</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td className="py-32" colSpan={5}>
                    <div className="flex flex-col items-center justify-center text-center opacity-60">
                      <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-display-lg" style={{ fontSize: '48px' }}>domain</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No clients found</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                clients.map((client: any) => (
                  <tr key={client.id} className="border-b border-outline-variant/50 hover:bg-surface-variant/5">
                    <td className="px-6 py-4">
                      <div className="font-body-md font-semibold text-on-surface">{client.name}</div>
                    </td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{client.industry}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{client.city}, {client.country}</td>
                    <td className="px-6 py-4">
                      <div className="font-body-md text-on-surface">{client.contact_name}</div>
                      <div className="text-xs text-on-surface-variant">{client.contact_email}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {client.status}
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

      {isFormOpen && (
        <ClientForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};
