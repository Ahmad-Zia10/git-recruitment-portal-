import React from 'react';
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from '../../../lib/status-machine';
import type { DashboardRecentApplication } from '../../../types/dashboard.types';

interface DashboardRecentApplicationsProps {
  applications: DashboardRecentApplication[];
}

export const DashboardRecentApplications: React.FC<DashboardRecentApplicationsProps> = ({
  applications,
}) => (
  <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Recent Allocations</h3>
    {!applications.length ? (
      <p className="text-sm text-on-surface-variant">No recent allocations.</p>
    ) : (
      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between border border-outline-variant/50 rounded-lg px-4 py-3"
          >
            <div>
              <div className="font-semibold text-sm text-on-surface">
                {app.candidate?.full_name ?? 'Unknown'}
              </div>
              <div className="text-xs text-on-surface-variant">
                {app.job_opening?.role?.title} at {app.job_opening?.company?.name}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold capitalize px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {APPLICATION_STATUS_LABELS[app.status as ApplicationStatus] ?? app.status}
              </span>
              {app.match_score != null && (
                <div className="text-[10px] text-on-surface-variant mt-1">{app.match_score}% match</div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);
