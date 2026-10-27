import React, { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Play, 
  CheckSquare, 
  Package, 
  Phone 
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

export const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobStatus, setJobStatus] = useState<'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'>('ASSIGNED');
  const [checklists, setChecklists] = useState([
    { id: 1, text: 'Isolate main 400V circuit breaker before panel removal', done: true },
    { id: 2, text: 'Measure suction and discharge refrigerant pressures with manifold gauge', done: false },
    { id: 3, text: 'Inspect dual run capacitor capacitance with multimeter (target: 45uF)', done: false },
    { id: 4, text: 'Clean condenser coils with low-pressure wash and check fan motor', done: false },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklists((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );
  };

  const completedCount = checklists.filter((c) => c.done).length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Field Technician Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Technician Workspace
            </span>
            <span className="text-xs text-slate-400">• Certified Specialist</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            Hello, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Apex Mechanical Fleet • You have <strong className="text-white">2 assigned jobs</strong> scheduled for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 block">Today's Shift</span>
            <span className="font-bold text-emerald-400">08:00 AM - 05:00 PM</span>
          </div>
        </div>
      </div>

      {/* Priority Active Work Order Card */}
      <div className="bg-white rounded-2xl border-2 border-blue-500/30 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-xs">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-blue-200">WO-2026-1001</span>
              <h2 className="text-base font-bold text-white leading-tight">
                Cold Storage Room 02 AC Leaking & Cooling Fault
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-xs">
              HIGH PRIORITY
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
              STATUS: {jobStatus}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Facility Location and Customer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">Customer & Facility</span>
              <p className="font-bold text-sm text-slate-900">Colombo Logistics Warehouse Hub</p>
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Main Cold Storage Facility, 100 Industrial Zone Expressway, Peliyagoda</span>
              </div>
            </div>
            <div className="space-y-1.5 md:border-l md:border-slate-200 md:pl-4">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">Appointment Window & Contact</span>
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Today: 02:00 PM – 04:00 PM</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Gate 3 Security Check-in: +94 11 555 7788</span>
              </div>
            </div>
          </div>

          {/* Quick Execution Actions */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Job Execution Actions
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {jobStatus === 'ASSIGNED' && (
                <button
                  onClick={() => setJobStatus('IN_PROGRESS')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition shadow-sm cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Arrive & Start Work Order
                </button>
              )}

              {jobStatus === 'IN_PROGRESS' && (
                <>
                  <button
                    onClick={() => setJobStatus('COMPLETED')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Job & Sign Off
                  </button>

                  <button
                    onClick={() => alert('Parts modal: Added 1x Dual Run Capacitor (CAP-45-5) to job receipt')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition border border-slate-300 cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-blue-600" />
                    Record Parts Used
                  </button>
                </>
              )}

              {jobStatus === 'COMPLETED' && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Work Order Completed & Ready for Invoicing!
                </span>
              )}
            </div>
          </div>

          {/* Field Checklist Protocol */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                Standard Cold Storage Diagnostic Protocol
              </h3>
              <span className="text-xs font-bold text-blue-600">
                {completedCount} of {checklists.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {checklists.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                    item.done
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 line-through'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleChecklist(item.id)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium">{item.text}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
