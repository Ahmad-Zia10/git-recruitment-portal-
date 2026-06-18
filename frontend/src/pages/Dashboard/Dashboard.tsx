import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';

export const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardAggregates'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto space-y-gutter animate-pulse">
        <section className="flex flex-col gap-1">
          <div className="h-10 bg-surface-container w-1/3 rounded-md"></div>
          <div className="h-6 bg-surface-container w-1/2 rounded-md"></div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-error">
        Failed to load dashboard data.
      </div>
    );
  }

  const summary = data?.summary || { total_active_openings: 0, total_candidates: 0, applications_this_month: 0, total_placed: 0, total_clients: 0, active_projects: 0, billing_summary: 0 };

  return (
    <>
      <section className="flex flex-col gap-1">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Resource Management Overview</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Track your resource allocations and enterprise bench metrics in real-time.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter mb-6">
        {/* Card 1: Total Clients */}
        <div className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant custom-shadow-l1 flex flex-col gap-4 group hover:border-primary/30 transition-standard">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/5 text-primary rounded-xl">
              <span className="material-symbols-outlined">domain</span>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">LIVE</span>
          </div>
          <div>
            <div className="text-display-lg font-display-lg text-on-surface group-hover:text-primary transition-standard">{summary.total_clients}</div>
            <div className="font-label-md text-label-md text-on-surface-variant">Total Clients</div>
          </div>
        </div>

        {/* Card 2: Active Projects */}
        <div className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant custom-shadow-l1 flex flex-col gap-4 group hover:border-primary/30 transition-standard">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/5 text-primary rounded-xl">
              <span className="material-symbols-outlined">folder_special</span>
            </div>
          </div>
          <div>
            <div className="text-display-lg font-display-lg text-on-surface group-hover:text-primary transition-standard">{summary.active_projects}</div>
            <div className="font-label-md text-label-md text-on-surface-variant">Active Projects</div>
          </div>
        </div>

        {/* Card 3: Open Requirements */}
        <div className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant custom-shadow-l1 flex flex-col gap-4 group hover:border-primary/30 transition-standard">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/5 text-primary rounded-xl">
              <span className="material-symbols-outlined">assignment</span>
            </div>
          </div>
          <div>
            <div className="text-display-lg font-display-lg text-on-surface group-hover:text-primary transition-standard">{summary.total_active_openings}</div>
            <div className="font-label-md text-label-md text-on-surface-variant">Open Requirements</div>
          </div>
        </div>

        {/* Card 4: Available Resources */}
        <div className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant custom-shadow-l1 flex flex-col gap-4 group hover:border-primary/30 transition-standard">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/5 text-primary rounded-xl">
              <span className="material-symbols-outlined">badge</span>
            </div>
          </div>
          <div>
            <div className="text-display-lg font-display-lg text-on-surface group-hover:text-primary transition-standard">{summary.total_candidates}</div>
            <div className="font-label-md text-label-md text-on-surface-variant">Available Resources</div>
          </div>
        </div>

        {/* Card 5: Active Allocations */}
        <div className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant custom-shadow-l1 flex flex-col gap-4 group hover:border-primary/30 transition-standard">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/5 text-primary rounded-xl">
              <span className="material-symbols-outlined">account_tree</span>
            </div>
          </div>
          <div>
            <div className="text-display-lg font-display-lg text-on-surface group-hover:text-primary transition-standard">{summary.total_placed}</div>
            <div className="font-label-md text-label-md text-on-surface-variant">Active Allocations</div>
          </div>
        </div>

        {/* Card 6: Billing Summary */}
        <div className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant custom-shadow-l1 flex flex-col gap-4 group hover:border-primary/30 transition-standard">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/5 text-primary rounded-xl">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-full">MONTHLY</span>
          </div>
          <div>
            <div className="text-display-lg font-display-lg text-on-surface group-hover:text-primary transition-standard">£{summary.billing_summary.toLocaleString()}</div>
            <div className="font-label-md text-label-md text-on-surface-variant">Billing Summary</div>
          </div>
        </div>
      </div>

      <section className="space-y-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">Quick Actions</h2>
          <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/5 rounded-full uppercase tracking-widest">Efficiency Tools</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <button className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant custom-shadow-l1 hover:shadow-md hover:border-primary-container transition-all text-left flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-brand bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-standard">
              <span className="material-symbols-outlined">add_business</span>
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm text-on-surface">Add Requirement</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Configure a new resource demand for a project.</p>
            </div>
          </button>
          
          <button className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant custom-shadow-l1 hover:shadow-md hover:border-primary-container transition-all text-left flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-brand bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-standard">
              <span className="material-symbols-outlined">person_add</span>
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm text-on-surface">Add Resource</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Import new engineering profiles to your bench.</p>
            </div>
          </button>
          
          <button className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant custom-shadow-l1 hover:shadow-md hover:border-primary-container transition-all text-left flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-brand bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-standard">
              <span className="material-symbols-outlined">post_add</span>
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm text-on-surface">Add Allocation</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Directly link a resource to an active requirement.</p>
            </div>
          </button>
          
          <button className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant custom-shadow-l1 hover:shadow-md hover:border-primary-container transition-all text-left flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-brand bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-standard">
              <span className="material-symbols-outlined">corporate_fare</span>
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm text-on-surface">Add Client</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Register a new enterprise partner or subsidiary.</p>
            </div>
          </button>
        </div>
      </section>
    </>
  );
};
