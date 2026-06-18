import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { hasPermission } from '../../utils/rbac';
import { JobOpeningForm } from './JobOpeningForm';

export const JobOpenings: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [hiringType, setHiringType] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobOpenings', search, status, hiringType, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (hiringType) params.append('hiring_type', hiringType);
      params.append('page', page.toString());
      
      const response = await apiClient.get('/job-openings', { params });
      return response.data.data;
    },
  });

  const jobs = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 };

  return (
    <div className="flex flex-col h-full w-full max-w-full min-w-0 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Requirements</h2>
          <p className="font-body-md text-on-surface-variant">Manage and track candidate requirements for all enterprise clients.</p>
        </div>
        
        {hasPermission('create_job') && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            Add Requirement
          </button>
        )}
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary transition-all text-body-md" 
            placeholder="Search by Requirement, Client or ID..." 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-outline-variant rounded-lg pl-4 pr-10 py-2 text-body-md focus:ring-2 focus:ring-primary-container/20 focus:border-primary cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Status: All</option>
              <option value="open">Open</option>
              <option value="on_hold">On Hold</option>
              <option value="filled">Filled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
          </div>
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-outline-variant rounded-lg pl-4 pr-10 py-2 text-body-md focus:ring-2 focus:ring-primary-container/20 focus:border-primary cursor-pointer"
              value={hiringType}
              onChange={(e) => setHiringType(e.target.value)}
            >
              <option value="">Hiring Type: All</option>
              <option value="permanent">Permanent</option>
              <option value="contract">Contract</option>
              <option value="fixed_term">Fixed Term</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
          </div>
          <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant" title="More Filters">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      {/* Enterprise DataTable Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-[12px] shadow-sm flex flex-col relative flex-1 min-h-[400px] w-full max-w-full min-w-0 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar w-full flex-1">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="sticky top-0 bg-surface-container-high z-10 border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">S.No</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Client</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Role</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-center">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Location</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Min Exp</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Budget</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Hiring Type</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-center">Positions</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Start Date</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-on-surface-variant">Loading records...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-error">Failed to load records</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={11}>
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                      <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">inventory_2</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No records found</h3>
                      <p className="font-body-md text-on-surface-variant max-w-sm">Data will appear here once records are added. Use the 'Add Requirement' button to create your first requirement listing.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map((job: any, index: number) => (
                  <tr key={job.id} className="border-b border-outline-variant/50 hover:bg-surface-variant/5">
                    <td className="px-6 py-4 font-body-md text-on-surface">{(page - 1) * meta.limit + index + 1}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{job.company?.name || 'N/A'}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{job.role?.title || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${job.status === 'open' ? 'bg-green-100 text-green-800' : 
                          job.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{job.location}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{job.min_exp_years} yrs</td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{job.budget_min ? `${job.budget_currency} ${job.budget_min}-${job.budget_max}` : 'N/A'}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface capitalize">{job.hiring_type.replace('_', ' ')}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface text-center">{job.no_of_positions}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{job.expected_start_date ? new Date(job.expected_start_date).toLocaleDateString() : 'TBD'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors p-1" title="View Details">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer / Pagination Area */}
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
        <JobOpeningForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};
