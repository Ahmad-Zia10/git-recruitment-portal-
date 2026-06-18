import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { hasPermission } from '../../utils/rbac';

export const Candidates: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['candidates', search, status, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      params.append('page', page.toString());
      
      const response = await apiClient.get('/candidates', { params });
      return response.data.data;
    },
  });

  const candidates = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 };

  const handleRowClick = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Resources</h2>
          <nav className="flex text-on-surface-variant font-label-md text-label-md mt-1">
            <span className="hover:text-primary cursor-pointer">Resource Management</span>
            <span className="mx-2">/</span>
            <span>Active Bench</span>
          </nav>
        </div>
        {hasPermission('create_candidate') && (
          <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-sm">
            <span className="material-symbols-outlined">person_add</span>
            Add Resource
          </button>
        )}
      </div>

      {/* Toolbar / Filters */}
      <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary transition-all text-body-md" 
            placeholder="Search resources..." 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg bg-white min-w-[200px]">
          <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
          <select 
            className="bg-transparent border-none outline-none text-on-surface-variant font-label-md cursor-pointer flex-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Status: All Active</option>
            <option value="active">Active</option>
            <option value="placed">Placed</option>
            <option value="inactive">Inactive</option>
            <option value="blacklisted">Blacklisted</option>
          </select>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <span className="text-on-surface-variant font-label-md mr-2">Showing {candidates.length} of {meta.total}</span>
          <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined text-on-surface-variant">download</span></button>
          <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined text-on-surface-variant">more_vert</span></button>
        </div>
      </section>

      {/* Data Table Main Area */}
      <section className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low/30">
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Experience</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Availability</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Day Rate</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-on-surface-variant">Loading records...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-error">Failed to load records</td>
                </tr>
              ) : candidates.length === 0 ? (
                <tr>
                  <td className="py-32" colSpan={7}>
                    <div className="flex flex-col items-center justify-center text-center opacity-60">
                      <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-display-lg" style={{ fontSize: '48px' }}>person_search</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No records found</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                        We couldn't find any resources matching your current filters. Try adjusting your search criteria or adding a new resource.
                      </p>
                      <button 
                        onClick={() => { setSearch(''); setStatus(''); }}
                        className="mt-6 border border-outline-variant bg-white px-6 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                candidates.map((candidate: any) => (
                  <tr 
                    key={candidate.id} 
                    className="border-b border-outline-variant/50 hover:bg-surface-variant/10 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(candidate)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-body-md text-on-surface font-semibold">{candidate.full_name}</div>
                      <div className="text-xs text-on-surface-variant mt-1">{candidate.current_role || 'No role'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-body-md text-on-surface text-sm">{candidate.email}</div>
                      <div className="text-xs text-on-surface-variant mt-1">{candidate.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{candidate.exp_years} Years</td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{candidate.current_location || 'N/A'}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface capitalize">{candidate.availability_status?.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface">{candidate.expected_day_rate ? `${candidate.currency} ${candidate.expected_day_rate}` : 'N/A'}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${candidate.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {candidate.status}
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

      {/* Drawer */}
      {isDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" 
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          <aside className="fixed right-0 top-0 h-screen w-full sm:w-[600px] bg-white shadow-2xl z-[70] flex flex-col border-l border-outline-variant transition-transform transform">
            <div className="p-6 border-b border-outline-variant flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '32px' }}>person</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md">{selectedCandidate?.full_name}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{selectedCandidate?.current_role || 'No role'}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors" onClick={() => setIsDrawerOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex px-6 border-b border-outline-variant bg-surface-container-low/20 overflow-x-auto no-scrollbar">
              <button className="px-4 py-4 font-label-md text-label-md text-primary border-b-2 border-primary whitespace-nowrap">Overview</button>
              <button className="px-4 py-4 font-label-md text-label-md text-on-surface-variant hover:text-primary whitespace-nowrap">Skills</button>
              <button className="px-4 py-4 font-label-md text-label-md text-on-surface-variant hover:text-primary whitespace-nowrap">Work History</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 bg-background/50 custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-on-surface mb-2">Contact Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-on-surface-variant block">Email</span>
                      <span>{selectedCandidate?.email}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Phone</span>
                      <span>{selectedCandidate?.phone}</span>
                    </div>
                  </div>
                </div>
                {/* Full Profile Implementation TBD */}
              </div>
            </div>
            
            <div className="p-6 border-t border-outline-variant bg-white flex gap-4">
              <button className="flex-1 bg-primary text-white py-3 rounded-lg font-label-md text-label-md font-semibold hover:opacity-90">Schedule Interview</button>
              <button className="px-6 py-3 border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low">Download CV</button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};
