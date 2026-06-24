import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardLoadingSkeleton } from '../components/DashboardLoadingSkeleton';
import { DashboardSummaryCards } from '../components/DashboardSummaryCards';
import { DashboardQuickActions } from '../components/DashboardQuickActions';

const emptySummary = {
  total_active_openings: 0,
  total_candidates: 0,
  applications_this_month: 0,
  total_placed: 0,
  total_clients: 0,
  billing_summary: 0,
};

export const DashboardPage: React.FC = () => {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center text-error">
        Failed to load dashboard data.
      </div>
    );
  }

  const summary = data?.summary ?? emptySummary;

  return (
    <>
      <section className="flex flex-col gap-1">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Candidate Management Overview
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Track your candidate allocations and enterprise bench metrics in real-time.
        </p>
      </section>

      <DashboardSummaryCards summary={summary} />
      <DashboardQuickActions />
    </>
  );
};
