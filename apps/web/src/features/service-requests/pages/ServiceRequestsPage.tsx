import React, { useState } from 'react';
import { ClipboardList, Plus, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { ServiceRequestStatus, PriorityLevel } from '@fieldops/contracts';

interface ServiceRequestItem {
  id: string;
  code: string;
  title: string;
  customerName: string;
  facility: string;
  serviceName: string;
  priority: PriorityLevel;
  status: ServiceRequestStatus;
  preferredDate: string;
  createdAt: string;
}

const mockRequests: ServiceRequestItem[] = [
  {
    id: 'req-1',
    code: 'REQ-2026-081',
    title: 'Cold storage unit 2 temperature rising above threshold',
    customerName: 'Colombo Logistics Warehouse Hub',
    facility: 'Main Cold Storage Facility, Peliyagoda',
    serviceName: 'Commercial VRF AC Inspection & Tune-Up',
    priority: PriorityLevel.HIGH,
    status: ServiceRequestStatus.CONVERTED,
    preferredDate: 'Today, 2:00 PM',
    createdAt: '2 hours ago',
  },
  {
    id: 'req-2',
    code: 'REQ-2026-082',
    title: 'Main server room backup chiller failure alarm',
    customerName: 'Apex Data Centers',
    facility: 'Orion City Facility, Colombo 09',
    serviceName: 'Chiller Diagnostics & Annual Service',
    priority: PriorityLevel.EMERGENCY,
    status: ServiceRequestStatus.REVIEWED,
    preferredDate: 'Today, ASAP',
    createdAt: '35 mins ago',
  },
  {
    id: 'req-3',
    code: 'REQ-2026-083',
    title: 'Factory ventilation fan squeaking and vibrating heavily',
    customerName: 'Lanka Industrial Fabrics',
    facility: 'Biyagama Free Trade Zone Plant',
    serviceName: 'Industrial Motor & Fan Inspection',
    priority: PriorityLevel.MEDIUM,
    status: ServiceRequestStatus.PENDING,
    preferredDate: 'Tomorrow Morning',
    createdAt: '10 mins ago',
  },
  {
    id: 'req-4',
    code: 'REQ-2026-084',
    title: 'Periodic quarterly electrical panel inspection request',
    customerName: 'Kandy City Centre Retail Hub',
    facility: 'Commercial Mall Facility, Kandy',
    serviceName: 'High-Voltage Panel Diagnostics',
    priority: PriorityLevel.LOW,
    status: ServiceRequestStatus.PENDING,
    preferredDate: 'Next Monday',
    createdAt: 'Just now',
  },
];

export const ServiceRequestsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');

  const getStatusBadge = (status: ServiceRequestStatus) => {
    switch (status) {
      case ServiceRequestStatus.CONVERTED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case ServiceRequestStatus.REVIEWED:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case ServiceRequestStatus.PENDING:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case ServiceRequestStatus.REJECTED:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case PriorityLevel.EMERGENCY:
        return 'bg-rose-100 text-rose-800 font-bold';
      case PriorityLevel.HIGH:
        return 'bg-orange-100 text-orange-800 font-semibold';
      case PriorityLevel.MEDIUM:
        return 'bg-amber-100 text-amber-800 font-medium';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredRequests = mockRequests.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Customer Service Requests
          </h1>
          <p className="text-sm text-slate-500">
            Intake portal for customer maintenance tickets and dispatcher triage
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" />
          New Service Request
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets by customer or title..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PENDING', 'REVIEWED', 'CONVERTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Ticket ID & Issue</th>
              <th className="px-6 py-3">Customer & Facility</th>
              <th className="px-6 py-3">Service Category</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Preferred Window</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-xs font-mono font-bold text-blue-600 block">{req.code}</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">{req.title}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{req.createdAt}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-800 block">{req.customerName}</span>
                  <span className="text-xs text-slate-500 block">{req.facility}</span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-700">{req.serviceName}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${getPriorityBadge(req.priority)}`}>
                    {req.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-600">{req.preferredDate}</td>
                <td className="px-6 py-4 text-right">
                  {req.status === ServiceRequestStatus.CONVERTED ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Work Orders
                    </span>
                  ) : (
                    <button className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                      <span>Dispatch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
