import React, { useState } from 'react';
import { Receipt, Plus, Search, DollarSign, CheckCircle2, Clock } from 'lucide-react';
import { InvoiceStatus } from '@fieldops/contracts';

interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  workOrderNumber: string;
  customerName: string;
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
}

const mockInvoices: InvoiceListItem[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-1041',
    workOrderNumber: 'WO-2026-0988',
    customerName: 'Colombo Logistics Warehouse Hub',
    subtotal: 290.0,
    tax: 29.0,
    total: 319.0,
    status: InvoiceStatus.PAID,
    issuedDate: '2026-10-20',
    dueDate: '2026-11-04',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-1042',
    workOrderNumber: 'WO-2026-0994',
    customerName: 'Apex Data Centers',
    subtotal: 580.0,
    tax: 58.0,
    total: 638.0,
    status: InvoiceStatus.PAID,
    issuedDate: '2026-10-22',
    dueDate: '2026-11-06',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-1043',
    workOrderNumber: 'WO-2026-1000',
    customerName: 'Lanka Industrial Fabrics',
    subtotal: 420.0,
    tax: 42.0,
    total: 462.0,
    status: InvoiceStatus.ISSUED,
    issuedDate: '2026-10-25',
    dueDate: '2026-11-09',
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-1044',
    workOrderNumber: 'WO-2026-0975',
    customerName: 'Kandy Retail Complex',
    subtotal: 180.0,
    tax: 18.0,
    total: 198.0,
    status: InvoiceStatus.OVERDUE,
    issuedDate: '2026-10-05',
    dueDate: '2026-10-20',
  },
];

export const InvoicesPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case InvoiceStatus.ISSUED:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case InvoiceStatus.OVERDUE:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredInvoices = mockInvoices.filter((inv) => {
    if (filter === 'ALL') return true;
    return inv.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            Invoices & Billing Ledger
          </h1>
          <p className="text-sm text-slate-500">
            Automated decimal-accurate service billing, tax calculations, and payment tracking
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Billed</span>
            <div className="mt-1 text-2xl font-bold text-slate-900">$1,617.00</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Settled / Paid</span>
            <div className="mt-1 text-2xl font-bold text-emerald-600">$957.00</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending Settlement</span>
            <div className="mt-1 text-2xl font-bold text-amber-600">$660.00</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number or customer..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'ISSUED', 'PAID', 'OVERDUE'].map((status) => (
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

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Invoice #</th>
              <th className="px-6 py-3">Work Order Ref</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Subtotal</th>
              <th className="px-6 py-3">Tax (10%)</th>
              <th className="px-6 py-3">Total Amount</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-blue-600">{inv.invoiceNumber}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{inv.workOrderNumber}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{inv.customerName}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(inv.status)}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">${inv.subtotal.toFixed(2)}</td>
                <td className="px-6 py-4 text-slate-500">${inv.tax.toFixed(2)}</td>
                <td className="px-6 py-4 font-bold text-slate-900">${inv.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  {inv.status === InvoiceStatus.PAID ? (
                    <span className="text-xs font-semibold text-emerald-600">Settled in Full</span>
                  ) : (
                    <button className="px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 cursor-pointer">
                      Record Payment
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
