import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-8 text-on-surface-variant">Loading project details...</div>;
  if (error || !data) return <div className="p-8 text-error">Failed to load project details.</div>;

  const project = data;
  const company = project.company;
  const requirements = project.job_openings || [];
  
  // Aggregate allocations & billing
  const allocations: any[] = [];
  let totalBilling = 0;

  requirements.forEach((req: any) => {
    (req.applications || []).forEach((app: any) => {
      if (app.status === 'placed') {
        allocations.push({ ...app, requirement: req });
        if (app.billing_record) {
          totalBilling += Number(app.billing_record.bill_to_customer_gbp_monthly || 0);
        }
      }
    });
  });

  return (
    <div className="flex-1 overflow-y-auto flex flex-col h-full relative space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/projects')} className="p-2 hover:bg-surface-variant/20 rounded-full transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">{project.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
              ${project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {project.status}
            </span>
            <span className="text-sm text-on-surface-variant">{company?.name}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Overview */}
        <div className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant shadow-sm col-span-2">
          <h3 className="font-headline-sm text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">info</span> Project Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Start Date</p>
              <p className="font-body-md text-on-surface">{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">End Date</p>
              <p className="font-body-md text-on-surface">{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Project Budget</p>
              <p className="font-body-md text-on-surface">{project.budget ? `£${Number(project.budget).toLocaleString()}` : 'Not Specified'}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Current Monthly Run Rate (Billing)</p>
              <p className="font-body-md font-bold text-primary">£{totalBilling.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant shadow-sm">
          <h3 className="font-headline-sm text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">domain</span> Client Information
          </h3>
          {company ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Company Name</p>
                <p className="font-body-md text-on-surface">{company.name}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Contact</p>
                <p className="font-body-md text-on-surface">{company.contact_name || 'N/A'}</p>
                <p className="text-sm text-on-surface-variant">{company.contact_email}</p>
              </div>
            </div>
          ) : (
            <p className="text-on-surface-variant">No client assigned.</p>
          )}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant shadow-sm">
        <h3 className="font-headline-sm text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">assignment</span> Requirements
        </h3>
        {requirements.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No requirements for this project.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low/30">
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase">Role</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase">Location/Mode</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase">Positions</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req: any) => (
                  <tr key={req.id} className="border-b border-outline-variant/50">
                    <td className="px-4 py-3 font-body-sm font-semibold">{req.role?.title || 'Unknown Role'}</td>
                    <td className="px-4 py-3 text-sm">{req.status}</td>
                    <td className="px-4 py-3 text-sm">{req.location} ({req.work_mode})</td>
                    <td className="px-4 py-3 text-sm">{req.filled_positions} / {req.no_of_positions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Allocations */}
      <div className="bg-surface-container-lowest p-6 rounded-brand border border-outline-variant shadow-sm">
        <h3 className="font-headline-sm text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">account_tree</span> Allocated Resources
        </h3>
        {allocations.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No resources currently allocated.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low/30">
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase">Resource Name</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase">Requirement Role</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase">Allocated Date</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase">Monthly Billing</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((app: any) => (
                  <tr key={app.id} className="border-b border-outline-variant/50">
                    <td className="px-4 py-3 font-body-sm font-semibold">{app.candidate?.full_name}</td>
                    <td className="px-4 py-3 text-sm">{app.requirement?.role?.title}</td>
                    <td className="px-4 py-3 text-sm">{app.placed_date ? new Date(app.placed_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-bold text-primary">
                      {app.billing_record?.bill_to_customer_gbp_monthly ? `£${app.billing_record.bill_to_customer_gbp_monthly}` : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
