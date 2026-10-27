import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { AdminDashboard } from '../components/AdminDashboard';
import { DispatcherDashboard } from '../components/DispatcherDashboard';
import { TechnicianDashboard } from '../components/TechnicianDashboard';
import { FinanceDashboard } from '../components/FinanceDashboard';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'TECHNICIAN':
      return <TechnicianDashboard />;
    case 'DISPATCHER':
      return <DispatcherDashboard />;
    case 'FINANCE':
      return <FinanceDashboard />;
    case 'ORG_ADMIN':
    case 'SUPER_ADMIN':
    default:
      return <AdminDashboard />;
  }
};
