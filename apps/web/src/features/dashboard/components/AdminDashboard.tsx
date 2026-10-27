import React from 'react';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  TrendingUp,
  Building2,
  DollarSign,
  Users
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const metrics = [
    { title: 'Fleet Work Orders', value: '28', change: '8 in progress', icon: ClipboardCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pending Triage', value: '4', change: 'Requires dispatch', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Total Revenue Billed', value: '$1,617.00', change: '98.5% SLA met', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Active Technicians', value: '4 / 4', change: '100% certified', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Executive Overview
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome, Administrator {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {user?.organization?.name || 'Apex Mechanical & Electrical Services'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            System Operational
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{m.title}</span>
                <div className={`p-2 rounded-lg ${m.bg}`}>
                  <Icon className={`w-5 h-5 ${m.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{m.value}</span>
                <span className="text-xs font-medium text-slate-500">{m.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lifecycle Pipeline & Architecture Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Service Order Lifecycle
            </h2>
            <span className="text-xs font-medium text-slate-400">Order Progression</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block">1. REQUEST</span>
              <span className="text-xs text-slate-500 mt-1 block">Customer intake</span>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <span className="text-xs font-bold text-blue-700 block">2. DISPATCH</span>
              <span className="text-xs text-blue-600 mt-1 block">Conflict checks</span>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-xs font-bold text-amber-700 block">3. EXECUTION</span>
              <span className="text-xs text-amber-600 mt-1 block">Checklists & Parts</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-700 block">4. INVOICING</span>
              <span className="text-xs text-emerald-600 mt-1 block">Billing & Settlement</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Environment Details
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between text-slate-600">
              <span>Organization</span>
              <span className="font-semibold text-slate-900">Apex Mechanical</span>
            </li>
            <li className="flex items-center justify-between text-slate-600">
              <span>Authentication</span>
              <span className="font-semibold text-slate-900">Signed Session Cookie</span>
            </li>
            <li className="flex items-center justify-between text-slate-600">
              <span>Database</span>
              <span className="font-semibold text-slate-900">PostgreSQL (Local)</span>
            </li>
            <li className="flex items-center justify-between text-slate-600">
              <span>Conflict Checks</span>
              <span className="font-semibold text-emerald-600">Enforced</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
