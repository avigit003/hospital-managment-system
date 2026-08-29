import React from 'react';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarCheck,
  FileText,
  CreditCard,
  Database,
  HeartPulse,
  Activity,
  Layers
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, dbStatus, onOpenDbModal }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'patients', label: 'Patients', icon: Users, badge: null },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope, badge: null },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck, badge: null },
    { id: 'records', label: 'Medical Records', icon: FileText, badge: null },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard, badge: null },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
          <HeartPulse className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight tracking-tight flex items-center gap-1.5">
            CareSync
            <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              HMS
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">JDBC + React Edition</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Hospital Modules
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Database Connection Footer Badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30">
        <button
          onClick={onOpenDbModal}
          className="w-full p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:bg-slate-800 hover:border-teal-500/50 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold text-slate-200">JDBC Database</span>
            </div>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                dbStatus?.connected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
              }`}
            />
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {dbStatus?.activeDbType || 'Connecting...'}
          </p>
          <span className="text-[10px] text-teal-400 group-hover:underline font-medium inline-block mt-1">
            Configure / Switch DB &rarr;
          </span>
        </button>
      </div>
    </aside>
  );
}
