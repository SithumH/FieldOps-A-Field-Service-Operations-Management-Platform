import React from 'react';
import { CalendarClock, CheckCircle, Clock } from 'lucide-react';

interface TechnicianColumn {
  id: string;
  name: string;
  skills: string[];
  isAvailable: boolean;
  jobs: {
    title: string;
    time: string;
    code: string;
    priority: string;
  }[];
}

const dispatchData: TechnicianColumn[] = [
  {
    id: 'tech-1',
    name: 'Kasun Perera',
    skills: ['HVAC Certified', 'VRF Chiller Diagnostics'],
    isAvailable: true,
    jobs: [
      {
        title: 'Cold Storage Room 02 AC Leaking',
        time: '02:00 PM - 04:00 PM',
        code: 'WO-2026-1001',
        priority: 'HIGH',
      },
    ],
  },
  {
    id: 'tech-2',
    name: 'Nuwan Fernando',
    skills: ['High-Voltage Electrical', 'PLC Controls'],
    isAvailable: true,
    jobs: [
      {
        title: 'Emergency Breaker Trip in Bay',
        time: '11:30 AM - 01:30 PM',
        code: 'WO-2026-1003',
        priority: 'EMERGENCY',
      },
    ],
  },
  {
    id: 'tech-3',
    name: 'Dinesh Kumara',
    skills: ['General Facility Maintenance'],
    isAvailable: true,
    jobs: [],
  },
];

export const DispatchBoardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-blue-600" />
            Dispatch & Technician Scheduling Board
          </h1>
          <p className="text-sm text-slate-500">Live conflict-free technician dispatch matrix and capacity view</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dispatchData.map((tech) => (
          <div key={tech.id} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900">{tech.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {tech.skills.map((s) => (
                    <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Available
              </span>
            </div>

            <div className="p-4 flex-1 space-y-3 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Today's Schedule ({tech.jobs.length} jobs)
              </span>

              {tech.jobs.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-lg">
                  <p className="text-xs text-slate-400">No appointments scheduled.</p>
                  <span className="text-[11px] text-blue-600 font-semibold mt-1 inline-block">Available for dispatch</span>
                </div>
              ) : (
                tech.jobs.map((job) => (
                  <div key={job.code} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-600">{job.code}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                        {job.priority}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

