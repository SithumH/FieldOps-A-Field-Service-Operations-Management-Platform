import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { DashboardOverviewPage } from '../features/dashboard/pages/DashboardOverviewPage';
import { ServiceRequestsPage } from '../features/service-requests/pages/ServiceRequestsPage';
import { WorkOrdersPage } from '../features/work-orders/pages/WorkOrdersPage';
import { DispatchBoardPage } from '../features/scheduling/pages/DispatchBoardPage';
import { TechniciansPage } from '../features/technicians/pages/TechniciansPage';
import { CustomersPage } from '../features/customers/pages/CustomersPage';
import { InventoryPage } from '../features/inventory/pages/InventoryPage';
import { InvoicesPage } from '../features/invoices/pages/InvoicesPage';
import { SettingsPage } from '../features/settings/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <DashboardOverviewPage />,
          },
          {
            path: 'requests',
            element: <ServiceRequestsPage />,
          },
          {
            path: 'work-orders',
            element: <WorkOrdersPage />,
          },
          {
            path: 'dispatch',
            element: <DispatchBoardPage />,
          },
          {
            path: 'technicians',
            element: <TechniciansPage />,
          },
          {
            path: 'customers',
            element: <CustomersPage />,
          },
          {
            path: 'inventory',
            element: <InventoryPage />,
          },
          {
            path: 'invoices',
            element: <InvoicesPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: '*',
            element: <Navigate to="/" replace />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
