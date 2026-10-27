import React from 'react';
import { UserSquare2, Plus, Phone, Mail, Award, CheckCircle, Clock } from 'lucide-react';

interface TechItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  hourlyRate: number;
  isAvailable: boolean;
  activeJob: string | null;
  skills: string[];
  completedJobs: number;
  rating: number;
}

const mockTechnicians: TechItem[] = [
  {
    id: 'tech-1',
    name: 'Kasun Perera',
    email: 'kasun.technician@apexservices.lk',
    phone: '+94 77 300 4000',
    hourlyRate: 35.0,
    isAvailable: true,
    activeJob: 'WO-2026-1001 (Cold Storage AC)',
    skills: ['HVAC Advanced Diagnostics', 'Refrigerant Handling', 'VRF Chiller Diagnostics'],
    completedJobs: 142,
    rating: 4.9,
  },
  {
    id: 'tech-2',
    name: 'Nuwan Fernando',
    email: 'nuwan.technician@apexservices.lk',
    phone: '+94 77 300 5000',
    hourlyRate: 40.0,
    isAvailable: true,
    activeJob: 'WO-2026-1003 (Emergency Breaker Trip)',
    skills: ['High-Voltage Electrical', 'PLC Automation', 'Industrial Switchgear'],
    completedJobs: 98,
    rating: 4.8,
  },
  {
    id: 'tech-3',
    name: 'Dinesh Kumara',
    email: 'dinesh.technician@apexservices.lk',
    phone: '+94 77 300 6000',
    hourlyRate: 30.0,
    isAvailable: true,
    activeJob: null,
    skills: ['Facility Maintenance', 'Hydraulic Pumps', 'Pipe Fitting'],
    completedJobs: 76,
    rating: 4.7,
  },
  {
    id: 'tech-4',
    name: 'Pradeep Chaminda',
    email: 'pradeep.technician@apexservices.lk',
    phone: '+94 77 300 7000',
    hourlyRate: 38.0,
    isAvailable: false,
    activeJob: null,
    skills: ['Commercial Refrigeration', 'Compressor Overhaul'],
    completedJobs: 110,
    rating: 4.9,
  },
];

export const TechniciansPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserSquare2 className="w-5 h-5 text-blue-600" />
            Field Technicians & Specialists
          </h1>
          <p className="text-sm text-slate-500">
            Certified technical roster, availability tracking, and skill qualifications
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" />
          Add Technician
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTechnicians.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-base border border-blue-100">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{t.name}</h3>
                    <span className="text-xs text-slate-500">Rate: ${t.hourlyRate.toFixed(2)} / hour</span>
                  </div>
                </div>

                {t.isAvailable ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Off Duty
                  </span>
                )}
              </div>

              {/* Skills */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Award className="w-3 h-3 text-blue-600" />
                  Certified Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {t.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.phone}</span>
                </div>
              </div>
            </div>

            {/* Footer metrics */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                <strong>{t.completedJobs}</strong> jobs completed • ★ {t.rating}
              </span>
              <span className="font-semibold text-blue-600 truncate max-w-[180px]">
                {t.activeJob || 'Ready for assignment'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

