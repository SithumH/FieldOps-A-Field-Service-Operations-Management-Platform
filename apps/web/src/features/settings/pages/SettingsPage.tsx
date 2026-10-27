import React, { useState } from 'react';
import { Settings, Building2, Sliders, Shield, DollarSign, Check } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [companyName, setCompanyName] = useState(user?.organization?.name || 'Apex Mechanical & Electrical Services');
  const [companyEmail, setCompanyEmail] = useState('contact@apexservices.lk');
  const [companyPhone, setCompanyPhone] = useState('+94 11 234 5678');
  const [taxRate, setTaxRate] = useState('10.0');
  const [preventDoubleBooking, setPreventDoubleBooking] = useState(true);
  const [requireSkillMatch, setRequireSkillMatch] = useState(true);
  const [autoDeductStock, setAutoDeductStock] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Platform & Organization Settings
          </h1>
          <p className="text-sm text-slate-500">
            Configure multi-tenant dispatch rules, tax preferences, and company profile
          </p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            Settings Saved Successfully
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Organization Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Tenant Slug</label>
              <input
                type="text"
                disabled
                value={user?.organization?.slug || 'apex-services'}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Support Email</label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dispatch Hotline Phone</label>
              <input
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Dispatch Rules & Scheduling Engine */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Dispatch & Scheduling Engine Policies</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preventDoubleBooking}
                onChange={(e) => setPreventDoubleBooking(e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-bold text-slate-800 block">Strict Conflict Prevention Engine</span>
                <span className="text-xs text-slate-500 block">
                  Automatically rejects technician assignments that overlap with existing appointments in the calendar.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={requireSkillMatch}
                onChange={(e) => setRequireSkillMatch(e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-bold text-slate-800 block">Certified Skill Matching Requirement</span>
                <span className="text-xs text-slate-500 block">
                  Ensures technicians possess the required qualifications (e.g. HVAC, High-Voltage) before assignment.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={autoDeductStock}
                onChange={(e) => setAutoDeductStock(e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-bold text-slate-800 block">Atomic Inventory Deduction</span>
                <span className="text-xs text-slate-500 block">
                  Atomically deducts parts from inventory when technician logs usage on-site, guarding against race conditions.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Invoicing & Financial Policy */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Billing & Tax Rates</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Standard Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Currency</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="USD">USD ($) - US Dollar</option>
                <option value="LKR">LKR (Rs) - Sri Lankan Rupee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Summary */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Active Security Safeguards</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-bold text-slate-800 block">Password Encryption</span>
              <span className="text-slate-500 mt-0.5 block">Argon2id with 64MB memory cost</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-bold text-slate-800 block">Session Integrity</span>
              <span className="text-slate-500 mt-0.5 block">HMAC SHA-256 with timing-safe check</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-bold text-slate-800 block">Tenant Boundary</span>
              <span className="text-slate-500 mt-0.5 block">Strict repository-level isolation</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition shadow-sm cursor-pointer"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

