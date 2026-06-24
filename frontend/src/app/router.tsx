import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { ClientsPage } from '../features/clients/pages/ClientsPage';
import { JobOpeningsPage } from '../features/job-openings/pages/JobOpeningsPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { CandidatesPage } from '../features/candidates/pages/CandidatesPage';
import { AllocationsPage } from '../features/applications/pages/AllocationsPage';
import { BillingPage } from '../features/billing/pages/BillingPage';
import { ProtectedRoute, PermissionRoute, RouteAccessGuard } from './guards';

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <PermissionRoute permission="view_dashboard">
              <DashboardPage />
            </PermissionRoute>
          }
        />
        <Route
          path="requirements"
          element={
            <PermissionRoute permission="view_jobs">
              <JobOpeningsPage />
            </PermissionRoute>
          }
        />
        <Route
          path="candidates"
          element={
            <PermissionRoute permission="view_candidates">
              <CandidatesPage />
            </PermissionRoute>
          }
        />
        <Route
          path="allocations"
          element={
            <PermissionRoute permission="view_applications">
              <AllocationsPage />
            </PermissionRoute>
          }
        />
        <Route
          path="clients"
          element={
            <PermissionRoute permission="view_companies">
              <ClientsPage />
            </PermissionRoute>
          }
        />
        <Route
          path="billing"
          element={
            <RouteAccessGuard path="/billing">
              <PermissionRoute permission="view_billing">
                <BillingPage />
              </PermissionRoute>
            </RouteAccessGuard>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
);
