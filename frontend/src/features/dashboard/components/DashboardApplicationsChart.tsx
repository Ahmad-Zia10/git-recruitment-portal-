import React from 'react';
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from '../../../lib/status-machine';

interface DashboardApplicationsChartProps {
  applicationsByStatus: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  shortlisted: 'bg-blue-500',
  screening: 'bg-indigo-500',
  interviewing: 'bg-purple-500',
  offered: 'bg-amber-500',
  placed: 'bg-green-500',
  rejected: 'bg-red-400',
  withdrawn: 'bg-gray-400',
};

export const DashboardApplicationsChart: React.FC<DashboardApplicationsChartProps> = ({
  applicationsByStatus,
}) => {
  const entries = Object.entries(applicationsByStatus).filter(([, count]) => count > 0);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (total === 0) {
    return (
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Pipeline by Status</h3>
        <p className="text-sm text-on-surface-variant">No applications in the pipeline yet.</p>
      </section>
    );
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Pipeline by Status</h3>
      <div className="space-y-3">
        {entries.map(([status, count]) => {
          const pct = Math.round((count / total) * 100);
          const label = APPLICATION_STATUS_LABELS[status as ApplicationStatus] ?? status;
          return (
            <div key={status}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-on-surface">{label}</span>
                <span className="text-on-surface-variant font-semibold">
                  {count} ({pct}%)
                </span>
              </div>
              <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={`h-full ${STATUS_COLORS[status] ?? 'bg-primary'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
