import React from 'react';
import { Receipt, DollarSign, CheckCircle2, Clock, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export const FinanceDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Finance Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              FINANCE & BILLING COCKPIT
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome, {user?.firstName} {user?.lastName} (Finance & Revenue)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reconcile completed field work orders, issue itemized invoices, and track payment settlements.
          </p>
        </div>
        <Link
          to="/invoices"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-sm"
        >
          <Receipt className="w-4 h-4" />
          <span>View Invoices Ledger</span>
        </Link>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Invoiced</span>
            <div className="mt-1 text-2xl font-bold text-slate-900">$1,617.00</div>
            <span className="text-xs text-slate-400">4 invoices issued</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payments Settled</span>
            <div className="mt-1 text-2xl font-bold text-emerald-600">$957.00</div>
            <span className="text-xs text-emerald-600 font-semibold">59.2% collection rate</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Outstanding Balance</span>
            <div className="mt-1 text-2xl font-bold text-amber-600">$660.00</div>
            <span className="text-xs text-rose-500 font-semibold">1 overdue invoice</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Ready for Invoicing List */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Completed Work Orders Ready for Invoicing
          </h2>
          <span className="text-xs text-slate-400">Exact Decimal Calculations Active</span>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-blue-600">WO-2026-1000</span>
            <p className="text-sm font-bold text-slate-900">Commercial Breaker Diagnostic & Relay Repair</p>
            <p className="text-xs text-slate-500">Customer: Lanka Industrial Fabrics • Tech: Nuwan Fernando</p>
          </div>
          <Link
            to="/invoices"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
          >
            <span>Generate Invoice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

