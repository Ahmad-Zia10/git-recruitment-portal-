import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { hasPermission } from '../../utils/rbac';

export const Pipeline: React.FC = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['applications', status, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page.toString());
      
      const response = await apiClient.get('/applications', { params });
      return response.data.data;
    },
  });

  const applications = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Allocation Board</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Manage active resource allocations and assignment stages.</p>
        </div>
        {hasPermission('create_application') && (
          <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
            <span className="material-symbols-outlined">post_add</span>
            New Allocation
          </button>
        )}
      </div>

      <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg bg-white min-w-[200px]">
          <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
          <select 
            className="bg-transparent border-none outline-none text-on-surface-variant font-label-md cursor-pointer flex-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Status: All Stages</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="screening">Screening</option>
            <option value="interviewing">Interviewing</option>
            <option value="offered">Offered</option>
            <option value="placed">Placed</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
        <div className="ml-auto flex items-center gap-2 text-on-surface-variant text-sm">
          Showing {applications.length} of {meta.total}
        </div>
      </section>

      <section className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low/30">
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Requirement</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Allocated On</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Match Score</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant">Loading records...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-error">Failed to load applications</td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td className="py-32" colSpan={6}>
                    <div className="flex flex-col items-center justify-center text-center opacity-60">
                      <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-display-lg" style={{ fontSize: '48px' }}>inbox</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No allocations found</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map((app: any) => (
                  <tr key={app.id} className="border-b border-outline-variant/50 hover:bg-surface-variant/5">
                    <td className="px-6 py-4">
                      <div className="font-body-md font-semibold text-on-surface">{app.candidate?.full_name}</div>
                      <div className="text-xs text-on-surface-variant">{app.candidate?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-body-md text-on-surface">{app.job_opening?.role?.title || 'Unknown Role'}</div>
                      <div className="text-xs text-on-surface-variant">{app.job_opening?.company?.name || 'Unknown Company'}</div>
                    </td>
                    <td className="px-6 py-4 font-body-md text-on-surface">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${app.match_score > 70 ? 'bg-green-500' : app.match_score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${app.match_score || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{app.match_score || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        className="bg-transparent border border-outline-variant rounded px-2 py-1 text-sm outline-none cursor-pointer"
                        value={app.status}
                        onChange={(e) => console.log('Update status', e.target.value)}
                        disabled={!hasPermission('edit_application')}
                      >
                        <option value="shortlisted">Shortlisted</option>
                        <option value="screening">Screening</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offered">Offered</option>
                        <option value="placed">Placed</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:underline text-sm font-semibold">View Details</button>
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
