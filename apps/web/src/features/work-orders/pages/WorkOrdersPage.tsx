import React, { useState } from 'react';
import { Wrench, Plus, Search } from 'lucide-react';
import { WorkOrderStatus, PriorityLevel } from '@fieldops/contracts';

interface MockWorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  customerName: string;
  status: WorkOrderStatus;
  priority: PriorityLevel;
  scheduledTime: string;
  technicianName: string;
}

const mockOrders: MockWorkOrder[] = [
  {
    id: 'wo-1',
    workOrderNumber: 'WO-2026-1001',
    title: 'Cold Storage Room 02 AC Leaking & Cooling Fault',
    customerName: 'Colombo Logistics Warehouse Hub',
    status: WorkOrderStatus.ASSIGNED,
    priority: PriorityLevel.HIGH,
    scheduledTime: 'Today, 2:00 PM - 4:00 PM',
    technicianName: 'Kasun Perera',
  },
  {
    id: 'wo-2',
    workOrderNumber: 'WO-2026-1002',
    title: 'Server Room Chiller Annual Maintenance',
    customerName: 'Apex Data Centers',
    status: WorkOrderStatus.SCHEDULED,
    priority: PriorityLevel.MEDIUM,
    scheduledTime: 'Tomorrow, 9:00 AM - 12:00 PM',
    technicianName: 'Unassigned',
  },
  {
    id: 'wo-3',
    workOrderNumber: 'WO-2026-1003',
    title: 'Emergency Breaker Trip in Manufacturing Bay',
    customerName: 'Lanka Industrial Fabrics',
    status: WorkOrderStatus.IN_PROGRESS,
    priority: PriorityLevel.EMERGENCY,
    scheduledTime: 'Today, 11:30 AM - 1:30 PM',
    technicianName: 'Nuwan Fernando',
  },
];

export const WorkOrdersPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');

  const getStatusBadge = (status: WorkOrderStatus) => {
    switch (status) {
      case WorkOrderStatus.ASSIGNED:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case WorkOrderStatus.IN_PROGRESS:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case WorkOrderStatus.COMPLETED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case WorkOrderStatus.SCHEDULED:
        return 'bg-purple-50 text-purple-700 border-purple-200';
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            Work Orders
          </h1>
          <p className="text-sm text-slate-500">Track and dispatch service jobs across your customer fleet</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
          <Plus className="w-4 h-4" />
          Create Work Order
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search work orders..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'SCHEDULED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
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

      {/* Work Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Job ID & Title</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Scheduled Window</th>
              <th className="px-6 py-3">Technician</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockOrders.map((wo) => (
              <tr key={wo.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-xs font-mono font-semibold text-blue-600 block">{wo.workOrderNumber}</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">{wo.title}</span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">{wo.customerName}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${getPriorityBadge(wo.priority)}`}>
                    {wo.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(wo.status)}`}>
                    {wo.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">{wo.scheduledTime}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{wo.technicianName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

