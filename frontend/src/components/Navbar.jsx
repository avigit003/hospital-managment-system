import React from 'react';
import {
  RotateCcw,
  Plus,
  Database,
  Calendar,
  Clock,
  Sparkles,
  UserPlus,
  CalendarPlus,
  Receipt
} from 'lucide-react';

export default function Navbar({
  activeTab,
  dbStatus,
  onRefresh,
  isRefreshing,
  onOpenQuickAction,
  onOpenDbModal
}) {
  const titles = {
    dashboard: { title: 'Hospital Overview', desc: 'Real-time hospital operations & KPI metrics' },
    patients: { title: 'Patient Directory', desc: 'Manage patient registrations, profiles & history' },
    doctors: { title: 'Medical Staff & Doctors', desc: 'Doctors roster, schedules and specializations' },
    appointments: { title: 'Appointments & Scheduling', desc: 'Book, manage and track patient consultations' },
    records: { title: 'Medical Records & Prescriptions', desc: 'Clinical diagnosis, treatment plans and notes' },
    billing: { title: 'Billing & Invoicing', desc: 'Generate bills, track payment statuses and receipts' },
  };

  const current = titles[activeTab] || { title: 'Hospital Management', desc: 'Manage hospital records' };
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{current.title}</h2>
        <p className="text-xs text-slate-500 font-medium">{current.desc}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 text-xs font-medium text-slate-600 border border-slate-200/60">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>{todayStr}</span>
        </div>

        {/* Database Status Button */}
        <button
          onClick={onOpenDbModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200/80 text-teal-800 hover:bg-teal-100 transition-colors text-xs font-semibold"
          title="Click to view JDBC connection details"
        >
          <Database className="w-3.5 h-3.5 text-teal-600" />
          <span>{dbStatus?.activeDbType || 'JDBC DB'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        {/* Refresh Data Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
          title="Refresh data from JDBC"
        >
          <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
        </button>

        {/* Quick Action Button */}
        <div className="flex items-center gap-2">
          {activeTab === 'patients' && (
            <button
              onClick={() => onOpenQuickAction('patient')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
          )}

          {activeTab === 'doctors' && (
            <button
              onClick={() => onOpenQuickAction('doctor')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Doctor</span>
            </button>
          )}

          {activeTab === 'appointments' && (
            <button
              onClick={() => onOpenQuickAction('appointment')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-all"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          )}

          {activeTab === 'records' && (
            <button
              onClick={() => onOpenQuickAction('record')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medical Record</span>
            </button>
          )}

          {activeTab === 'billing' && (
            <button
              onClick={() => onOpenQuickAction('billing')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-all"
            >
              <Receipt className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
