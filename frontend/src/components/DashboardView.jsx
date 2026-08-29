import React from 'react';
import {
  Users,
  Stethoscope,
  CalendarCheck,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserPlus,
  CalendarPlus,
  Receipt,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export default function DashboardView({
  stats,
  loading,
  onNavigate,
  onOpenQuickAction,
  onStatusUpdate
}) {
  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading Dashboard Metrics via JDBC...</p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tab: 'patients',
    },
    {
      title: 'Active Doctors',
      value: stats?.totalDoctors || 0,
      icon: Stethoscope,
      color: 'from-teal-500 to-emerald-600',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      tab: 'doctors',
    },
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      sub: `${stats?.pendingAppointments || 0} pending schedule`,
      icon: CalendarCheck,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      tab: 'appointments',
    },
    {
      title: 'Paid Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sub: `$${(stats?.pendingRevenue || 0).toFixed(2)} pending invoices`,
      icon: CreditCard,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      tab: 'billing',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome Banner & Quick Action Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                <ShieldCheck className="w-3.5 h-3.5" /> JDBC Connected Live
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">CareSync Hospital Command Center</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Complete patient management, doctor schedules, clinical records, and billing powered by robust Java JDBC.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenQuickAction('patient')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold shadow-lg shadow-teal-500/30 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Register Patient</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('appointment')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>+ Book Appointment</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('billing')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>+ Create Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(kpi.tab)}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-teal-500/40"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {kpi.title}
                </span>
                <div className={`p-2.5 rounded-xl ${kpi.bgColor} ${kpi.textColor} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</div>
              {kpi.sub ? (
                <p className="text-xs text-slate-500 font-medium mt-1">{kpi.sub}</p>
              ) : (
                <div className="flex items-center gap-1 text-xs text-teal-600 font-medium mt-1">
                  <span>View records</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Appointments & Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Recent & Upcoming Appointments</h3>
              <p className="text-xs text-slate-500">Live consultation queue from database</p>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View All &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3">Patient</th>
                  <th className="py-3 px-3">Doctor</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
                  stats.recentAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800">{app.patientName || `Patient #${app.patientId}`}</div>
                        <div className="text-[11px] text-slate-400">{app.patientContact || 'No contact'}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-700">{app.doctorName || `Doctor #${app.doctorId}`}</div>
                        <div className="text-[11px] text-teal-600">{app.doctorSpecialization}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <div>{app.appointmentDate}</div>
                        <div className="text-[11px] text-slate-400">{app.appointmentTime}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : app.status === 'CANCELLED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {app.status === 'SCHEDULED' && (
                          <button
                            onClick={() => onStatusUpdate(app.id, 'COMPLETED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold transition-colors"
                          >
                            Mark Done
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No appointments recorded yet. Click "Book Appointment" to add.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Registered Patients (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 text-base">New Patients</h3>
              <p className="text-xs text-slate-500">Recently registered patients</p>
            </div>
            <button
              onClick={() => onNavigate('patients')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View All &rarr;
            </button>
          </div>

          <div className="space-y-3.5 flex-1">
            {stats?.recentPatients && stats.recentPatients.length > 0 ? (
              stats.recentPatients.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs">{p.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.gender}, {p.age} yrs • Blood: <span className="font-bold text-teal-600">{p.bloodGroup || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{p.createdAt || 'Recent'}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No registered patients.</p>
            )}
          </div>

          <button
            onClick={() => onOpenQuickAction('patient')}
            className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-teal-400/60 bg-teal-50/50 hover:bg-teal-50 text-teal-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Patient</span>
          </button>
        </div>
      </div>
    </div>
  );
}
