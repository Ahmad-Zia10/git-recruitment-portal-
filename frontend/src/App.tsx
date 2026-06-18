import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/layout/Layout';

import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { JobOpenings } from './pages/JobOpenings/JobOpenings';
import { Candidates } from './pages/Candidates/Candidates';
import { Pipeline } from './pages/Applications/Pipeline';
import { Clients } from './pages/Clients/Clients';
import { Billing } from './pages/Billing/Billing';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="requirements" element={<JobOpenings />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="allocations" element={<Pipeline />} />
            <Route path="clients" element={<Clients />} />
            <Route path="billing" element={<Billing />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
