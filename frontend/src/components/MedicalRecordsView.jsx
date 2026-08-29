import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Search,
  User,
  Stethoscope,
  Calendar,
  Pill,
  Activity,
  X,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';

export default function MedicalRecordsView({
  records,
  patients,
  doctors,
  loading,
  onCreate,
  onUpdate,
  onDelete,
  onShowToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [patientFilter, setPatientFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [printingRecord, setPrintingRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const initialForm = {
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    diagnosis: '',
    symptoms: '',
    prescription: '',
    treatmentPlan: '',
    visitDate: new Date().toISOString().split('T')[0],
    notes: '',
  };
  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      diagnosis: '',
      symptoms: '',
      prescription: '',
      treatmentPlan: '',
      visitDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (rec) => {
    setEditingRecord(rec);
    setFormData({
      patientId: rec.patientId,
      doctorId: rec.doctorId || '',
      diagnosis: rec.diagnosis,
      symptoms: rec.symptoms || '',
      prescription: rec.prescription || '',
      treatmentPlan: rec.treatmentPlan || '',
      visitDate: rec.visitDate,
      notes: rec.notes || '',
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.diagnosis.trim()) {
      onShowToast('Patient and Diagnosis are required', 'error');
      return;
    }

    try {
      if (editingRecord) {
        await onUpdate(editingRecord.id, formData);
        setEditingRecord(null);
      } else {
        await onCreate(formData);
        setIsAddModalOpen(false);
      }
    } catch {
      // Handled by parent
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    await onDelete(deletingId);
    setDeletingId(null);
  };

  const filteredRecords = records.filter((rec) => {
    const pName = (rec.patientName || '').toLowerCase();
    const dName = (rec.doctorName || '').toLowerCase();
    const diag = (rec.diagnosis || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = pName.includes(search) || dName.includes(search) || diag.includes(search);
    const matchesPatient = patientFilter === 'ALL' || String(rec.patientId) === patientFilter;

    return matchesSearch && matchesPatient;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Search & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records by diagnosis, symptoms, patient..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Patient Selector Filter */}
          <select
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Patients</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (#{p.id})
              </option>
            ))}
          </select>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Medical Record</span>
          </button>
        </div>
      </div>

      {/* Medical Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Diagnosis & Symptoms</th>
                <th className="py-3.5 px-4">Prescription & Plan</th>
                <th className="py-3.5 px-4">Attending Doctor</th>
                <th className="py-3.5 px-4">Visit Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading medical records via JDBC...</span>
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-xs">{rec.patientName || `Patient #${rec.patientId}`}</div>
                      <div className="text-[11px] text-slate-400">ID: #{rec.patientId}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-teal-800 text-xs">{rec.diagnosis}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">{rec.symptoms || 'None'}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-700 truncate">{rec.prescription || 'No rx'}</div>
                      <div className="text-[11px] text-slate-400 truncate">{rec.treatmentPlan || 'Routine rest'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{rec.doctorName || 'Staff Physician'}</div>
                      <div className="text-[11px] text-teal-600">{rec.doctorSpecialization}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {rec.visitDate}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPrintingRecord(rec)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                          title="View / Print Prescription"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(rec)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                          title="Edit Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(rec.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No medical records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medical Record Modal */}
      {(isAddModalOpen || editingRecord) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingRecord ? 'Edit Clinical Record' : 'Create Medical Record / Prescription'}
                </h3>
                <p className="text-xs text-slate-500">Persists clinical encounter via JDBC</p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingRecord(null);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Patient <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (#{p.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attending Doctor</label>
                  <select
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value ? parseInt(e.target.value) : '' })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">-- Optional / Staff Doctor --</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Primary Diagnosis <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acute Bronchitis, Type 2 Diabetes"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Visit Date</label>
                  <input
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Presenting Symptoms</label>
                <textarea
                  rows="2"
                  placeholder="Fever, shortness of breath, joint pain, nausea..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Prescription & Dosages (Rx)
                </label>
                <textarea
                  rows="3"
                  placeholder="1. Amoxicillin 500mg - 1 tab 3x daily for 5 days&#10;2. Paracetamol 650mg - 1 tab SOS"
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Treatment Plan & Advice</label>
                <textarea
                  rows="2"
                  placeholder="Rest, hydration, physical therapy, follow-up in 1 week..."
                  value={formData.treatmentPlan}
                  onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingRecord(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 transition-all"
                >
                  {editingRecord ? 'Update Record' : 'Save Medical Record (JDBC)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View & Print Prescription Modal */}
      {printingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-scaleUp text-slate-800">
            {/* Prescription Header */}
            <div className="flex items-start justify-between border-b-2 border-teal-600 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-teal-700 font-black text-lg">
                  <HeartPulse className="w-6 h-6" />
                  <span>CareSync Hospital</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Department of Clinical Medicine</p>
                <p className="text-[10px] text-slate-400">100 Healthcare Blvd, Metro City • Ph: (555) 019-2831</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-800">
                  {printingRecord.doctorName || 'Attending Physician'}
                </div>
                <div className="text-[11px] text-teal-600 font-medium">{printingRecord.doctorSpecialization || 'General Practice'}</div>
                <div className="text-[10px] text-slate-400 mt-1">Date: {printingRecord.visitDate}</div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="grid grid-cols-2 gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Patient Name</span>
                <span className="font-bold text-slate-800">{printingRecord.patientName || `Patient #${printingRecord.patientId}`}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Patient ID</span>
                <span className="font-bold text-slate-800">#{printingRecord.patientId}</span>
              </div>
            </div>

            {/* Clinical Content */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                  Diagnosis
                </h4>
                <p className="font-semibold text-teal-800 text-sm">{printingRecord.diagnosis}</p>
                {printingRecord.symptoms && (
                  <p className="text-slate-600 text-xs mt-1">
                    <span className="font-medium text-slate-500">Symptoms:</span> {printingRecord.symptoms}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-teal-600" />
                  Prescribed Medications (Rx)
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 whitespace-pre-line font-mono text-xs text-slate-800 leading-relaxed">
                  {printingRecord.prescription || 'No medicines prescribed.'}
                </div>
              </div>

              {printingRecord.treatmentPlan && (
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                    Advice & Treatment Plan
                  </h4>
                  <p className="text-slate-700 leading-relaxed">{printingRecord.treatmentPlan}</p>
                </div>
              )}
            </div>

            {/* Footer Signature */}
            <div className="pt-8 mt-6 border-t border-slate-200 flex items-end justify-between">
              <div className="text-[10px] text-slate-400">
                Generated from CareSync HMS via JDBC
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 pb-1 mb-1 font-signature italic text-slate-700 text-xs">
                  {printingRecord.doctorName || 'Authorized Sign'}
                </div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Doctor Signature</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setPrintingRecord(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Delete Medical Record?</h3>
                <p className="text-xs text-slate-500">Deletes clinical diagnosis entry via JDBC</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to permanently delete this medical record?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
