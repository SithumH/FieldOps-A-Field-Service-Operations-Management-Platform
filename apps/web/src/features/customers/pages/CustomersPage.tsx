import React from 'react';
import { Users, Plus, Phone, Mail, MapPin } from 'lucide-react';

interface CustomerItem {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  activeOrders: number;
}

const mockCustomers: CustomerItem[] = [
  {
    id: 'c-1',
    name: 'Colombo Logistics Warehouse Hub',
    company: 'Colombo Logistics Ltd',
    email: 'facilities@colombologistichub.lk',
    phone: '+94 11 555 7788',
    city: 'Peliyagoda, Western',
    activeOrders: 1,
  },
  {
    id: 'c-2',
    name: 'Apex Data Centers',
    company: 'Apex Infrastructure PLC',
    email: 'ops@apexdatacenters.lk',
    phone: '+94 11 444 3322',
    city: 'Orion City, Colombo 09',
    activeOrders: 1,
  },
  {
    id: 'c-3',
    name: 'Lanka Industrial Fabrics',
    company: 'Lanka Industrial Holdings',
    email: 'plant.maintenance@lankafabrics.lk',
    phone: '+94 33 222 1100',
    city: 'Biyagama Free Trade Zone',
    activeOrders: 1,
  },
];

export const CustomersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Customer Directory
          </h1>
          <p className="text-sm text-slate-500">Manage client accounts, service agreements, and service facilities</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockCustomers.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                <span className="text-xs text-blue-600 font-medium">{c.company}</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.city}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {c.activeOrders} active work orders
              </span>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800">
                View Account →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

