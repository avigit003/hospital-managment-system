import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Search,
  DollarSign,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  AlertTriangle,
  Building2
} from 'lucide-react';

export default function BillingView({
  invoices,
  patients,
  appointments,
  loading,
  onCreate,
  onUpdate,
  onUpdateStatus,
  onDelete,
  onShowToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [printingInvoice, setPrintingInvoice] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const initialForm = {
    patientId: patients[0]?.id || '',
    appointmentId: '',
    consultationFee: 100,
    medicineFee: 0,
    testFee: 0,
    otherCharges: 0,
    paymentStatus: 'PAID',
    paymentMode: 'CASH',
    billingDate: new Date().toISOString().split('T')[0],
    notes: '',
  };
  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setFormData({
      patientId: patients[0]?.id || '',
      appointmentId: '',
      consultationFee: 100,
      medicineFee: 0,
      testFee: 0,
      otherCharges: 0,
      paymentStatus: 'PAID',
      paymentMode: 'CASH',
      billingDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (inv) => {
    setEditingInvoice(inv);
    setFormData({
      patientId: inv.patientId,
      appointmentId: inv.appointmentId || '',
      consultationFee: inv.consultationFee,
      medicineFee: inv.medicineFee,
      testFee: inv.testFee,
      otherCharges: inv.otherCharges,
      paymentStatus: inv.paymentStatus,
      paymentMode: inv.paymentMode,
      billingDate: inv.billingDate,
      notes: inv.notes || '',
    });
  };

  const calculateTotal = (f) => {
    return (
      (parseFloat(f.consultationFee) || 0) +
      (parseFloat(f.medicineFee) || 0) +
      (parseFloat(f.testFee) || 0) +
      (parseFloat(f.otherCharges) || 0)
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      onShowToast('Please select a patient', 'error');
      return;
    }

    const payload = {
      ...formData,
      consultationFee: parseFloat(formData.consultationFee) || 0,
      medicineFee: parseFloat(formData.medicineFee) || 0,
      testFee: parseFloat(formData.testFee) || 0,
      otherCharges: parseFloat(formData.otherCharges) || 0,
      appointmentId: formData.appointmentId ? parseInt(formData.appointmentId) : null,
    };

    try {
      if (editingInvoice) {
        await onUpdate(editingInvoice.id, payload);
        setEditingInvoice(null);
      } else {
        await onCreate(payload);
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

  const filteredInvoices = invoices.filter((inv) => {
    const pName = (inv.patientName || '').toLowerCase();
    const mode = (inv.paymentMode || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = pName.includes(search) || mode.includes(search) || String(inv.id).includes(search);
    const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalCollected = invoices
    .filter((i) => i.paymentStatus === 'PAID')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalPending = invoices
    .filter((i) => i.paymentStatus === 'PENDING')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Revenue Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Invoices
            </span>
            <span className="text-2xl font-black text-slate-800">{invoices.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Collected (PAID)
            </span>
            <span className="text-2xl font-black text-emerald-600">
              ${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Pending Collections
            </span>
            <span className="text-2xl font-black text-amber-600">
              ${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Header Search & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice ID, patient name, payment mode..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="PARTIAL">PARTIAL</option>
          </select>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Invoice # & Date</th>
                <th className="py-3.5 px-4">Patient Details</th>
                <th className="py-3.5 px-4">Fee Breakdown</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Mode</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading billing ledgers via JDBC...</span>
                  </td>
                </tr>
              ) : filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">INV-#{inv.id.toString().padStart(4, '0')}</div>
                      <div className="text-[11px] text-slate-400">{inv.billingDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-xs">{inv.patientName || `Patient #${inv.patientId}`}</div>
                      <div className="text-[11px] text-slate-400">{inv.patientContact}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-600">
                      <div>Consultation: ${inv.consultationFee?.toFixed(2)}</div>
                      <div className="text-slate-400">
                        Meds: ${inv.medicineFee?.toFixed(2)} • Tests: ${inv.testFee?.toFixed(2)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-black text-slate-800">
                        ${inv.totalAmount?.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {inv.paymentMode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={inv.paymentStatus}
                        onChange={(e) => onUpdateStatus(inv.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          inv.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : inv.paymentStatus === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <option value="PAID">PAID</option>
                        <option value="PENDING">PENDING</option>
                        <option value="PARTIAL">PARTIAL</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPrintingInvoice(inv)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                          title="Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(inv)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                          title="Edit Invoice"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(inv.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No billing invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Invoice Modal */}
      {(isAddModalOpen || editingInvoice) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingInvoice ? 'Edit Invoice' : 'Generate Hospital Invoice'}
                </h3>
                <p className="text-xs text-slate-500">Calculates and stores billing ledger in JDBC</p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingInvoice(null);
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
                  <label className="block font-semibold text-slate-700 mb-1">Billing Date</label>
                  <input
                    type="date"
                    value={formData.billingDate}
                    onChange={(e) => setFormData({ ...formData, billingDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Breakdown Fields */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Charge Breakdown ($)
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Consultation Fee</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Pharmacy / Medicines</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.medicineFee}
                      onChange={(e) => setFormData({ ...formData, medicineFee: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Lab / Diagnostic Tests</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.testFee}
                      onChange={(e) => setFormData({ ...formData, testFee: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Other / Room Charges</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.otherCharges}
                      onChange={(e) => setFormData({ ...formData, otherCharges: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Calculated Total:</span>
                  <span className="text-lg font-black text-teal-700">
                    ${calculateTotal(formData).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="UPI">UPI / Digital Wallet</option>
                    <option value="INSURANCE">Insurance Claim</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                    <option value="PARTIAL">PARTIAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Billing Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Paid at reception counter, reference receipt #1029"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingInvoice(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 transition-all"
                >
                  {editingInvoice ? 'Update Invoice' : 'Generate Invoice (JDBC)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Receipt Modal */}
      {printingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-scaleUp text-slate-800">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-teal-700 font-black text-lg">
                  <Building2 className="w-6 h-6" />
                  <span>CareSync Hospital</span>
                </div>
                <p className="text-[10px] text-slate-400">Tax Invoice & Cash Receipt</p>
                <p className="text-[10px] text-slate-400">100 Healthcare Blvd, Metro City</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">
                  INV-#{printingInvoice.id.toString().padStart(4, '0')}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Date: {printingInvoice.billingDate}</div>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${
                    printingInvoice.paymentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  STATUS: {printingInvoice.paymentStatus}
                </span>
              </div>
            </div>

            {/* Bill To */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-6 text-xs flex justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Billed To:</span>
                <span className="font-bold text-slate-800">{printingInvoice.patientName || `Patient #${printingInvoice.patientId}`}</span>
                <div className="text-[11px] text-slate-500">{printingInvoice.patientContact}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Mode</span>
                <span className="font-bold text-slate-800">{printingInvoice.paymentMode}</span>
              </div>
            </div>

            {/* Itemized Table */}
            <table className="w-full text-xs text-left mb-6">
              <thead className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-right">Amount ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 text-slate-700">Doctor Consultation Services</td>
                  <td className="py-2 text-right font-medium">${printingInvoice.consultationFee?.toFixed(2)}</td>
                </tr>
                {printingInvoice.medicineFee > 0 && (
                  <tr>
                    <td className="py-2 text-slate-700">Pharmacy & Dispensed Medications</td>
                    <td className="py-2 text-right font-medium">${printingInvoice.medicineFee?.toFixed(2)}</td>
                  </tr>
                )}
                {printingInvoice.testFee > 0 && (
                  <tr>
                    <td className="py-2 text-slate-700">Diagnostic & Laboratory Investigations</td>
                    <td className="py-2 text-right font-medium">${printingInvoice.testFee?.toFixed(2)}</td>
                  </tr>
                )}
                {printingInvoice.otherCharges > 0 && (
                  <tr>
                    <td className="py-2 text-slate-700">Room / Facility / Service Charges</td>
                    <td className="py-2 text-right font-medium">${printingInvoice.otherCharges?.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="border-t-2 border-slate-900 font-bold text-slate-900">
                <tr>
                  <td className="py-3 text-sm">Grand Total</td>
                  <td className="py-3 text-right text-base text-teal-700 font-black">
                    ${printingInvoice.totalAmount?.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {printingInvoice.notes && (
              <p className="text-[11px] text-slate-500 italic mb-6">
                Notes: {printingInvoice.notes}
              </p>
            )}

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
              <span>Thank you for choosing CareSync Healthcare.</span>
              <span>Authorized Receipt</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setPrintingInvoice(null)}
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
                <h3 className="text-base font-bold text-slate-800">Delete Invoice?</h3>
                <p className="text-xs text-slate-500">Deletes ledger entry via JDBC</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to delete this invoice record from the database?
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
                Delete Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
