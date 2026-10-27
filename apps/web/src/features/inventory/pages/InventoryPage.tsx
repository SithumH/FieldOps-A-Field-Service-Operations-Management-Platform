import React from 'react';
import { Package, Plus, AlertCircle } from 'lucide-react';

interface PartItem {
  sku: string;
  name: string;
  unitCost: number;
  unitPrice: number;
  quantityOnHand: number;
  reorderLevel: number;
}

const mockInventory: PartItem[] = [
  {
    sku: 'R410A-CYL',
    name: 'R-410A Refrigerant 11.3kg Cylinder',
    unitCost: 80.0,
    unitPrice: 140.0,
    quantityOnHand: 15,
    reorderLevel: 4,
  },
  {
    sku: 'CAP-45-5',
    name: 'Dual Run Capacitor 45/5 MFD 440V',
    unitCost: 12.0,
    unitPrice: 28.0,
    quantityOnHand: 32,
    reorderLevel: 8,
  },
  {
    sku: 'CON-3P-40A',
    name: '3-Pole 40A Heavy-Duty Contactor Relay',
    unitCost: 22.0,
    unitPrice: 55.0,
    quantityOnHand: 3,
    reorderLevel: 5,
  },
];

export const InventoryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Inventory & Parts Management
          </h1>
          <p className="text-sm text-slate-500">Track stock levels, unit pricing, and consumption across job sites</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
          <Plus className="w-4 h-4" />
          Add Part SKU
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Part Description</th>
              <th className="px-6 py-3">Stock on Hand</th>
              <th className="px-6 py-3">Unit Cost</th>
              <th className="px-6 py-3">Billing Price</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockInventory.map((item) => {
              const isLowStock = item.quantityOnHand <= item.reorderLevel;
              return (
                <tr key={item.sku} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">{item.sku}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{item.quantityOnHand} units</td>
                  <td className="px-6 py-4 text-slate-500">${item.unitCost.toFixed(2)}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">${item.unitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {isLowStock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        Reorder Alert
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

