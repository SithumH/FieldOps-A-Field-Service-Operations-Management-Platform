import React from 'react';
import { 
  CalendarClock, 
  AlertTriangle, 
  UserSquare2, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ClipboardList
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export const DispatcherDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Dispatcher Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
              Dispatch Operations
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome, Dispatcher {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage incoming maintenance requests, schedule technicians, and eliminate booking conflicts.
          </p>
        </div>
        <Link
          to="/dispatch"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-sm"
        >
          <CalendarClock className="w-4 h-4" />
          <span>Open Full Dispatch Board</span>
        </Link>
      </div>

      {/* Urgent Dispatch Action Alert */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              1 Emergency Service Request Awaiting Dispatch
            </h3>
            <p className="text-xs text-amber-700">
              REQ-2026-082 (Apex Data Centers: Server room backup chiller alarm) requires technician allocation.
            </p>
          </div>
        </div>
        <Link
          to="/requests"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition shrink-0"
        >
          <span>Triage Ticket</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Dispatcher Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Unassigned Jobs</span>
            <div className="mt-1 text-2xl font-bold text-slate-900">1</div>
            <span className="text-xs text-slate-400">Requires scheduling</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Field Techs Available</span>
            <div className="mt-1 text-2xl font-bold text-emerald-600">2 / 4</div>
            <span className="text-xs text-slate-400">Ready for assignment</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <UserSquare2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Scheduling Conflicts</span>
            <div className="mt-1 text-2xl font-bold text-blue-600">0 Overlaps</div>
            <span className="text-xs text-slate-500 font-medium mt-0.5">
              No overlapping assignments
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Active Technicians Quick Status */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserSquare2 className="w-4 h-4 text-blue-600" />
            Technician Availability Status
          </h2>
          <Link to="/technicians" className="text-xs font-bold text-blue-600 hover:text-blue-800">
            View All Technicians →
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                KP
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Kasun Perera</span>
                <span className="text-slate-500">HVAC Diagnostics • On job: WO-2026-1001</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Assigned (02:00 PM - 04:00 PM)
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                NF
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Nuwan Fernando</span>
                <span className="text-slate-500">High-Voltage Electrical • On job: WO-2026-1003</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              In Progress
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                DK
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Dinesh Kumara</span>
                <span className="text-slate-500">General Maintenance • No active job</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Available for Dispatch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

