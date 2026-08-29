import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import PatientsView from './components/PatientsView';
import DoctorsView from './components/DoctorsView';
import AppointmentsView from './components/AppointmentsView';
import MedicalRecordsView from './components/MedicalRecordsView';
import BillingView from './components/BillingView';
import DatabaseSettingsModal from './components/DatabaseSettingsModal';
import Toast from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Entities state
  const [dashboardStats, setDashboardStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);

  // Modals & Toast
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 4000);
  };

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, patRes, docRes, appRes, recRes, billRes, dbRes] = await Promise.allSettled([
        api.getDashboardStats(),
        api.getPatients(),
        api.getDoctors(),
        api.getAppointments(),
        api.getMedicalRecords(),
        api.getInvoices(),
        api.getSystemStatus(),
      ]);

      if (statsRes.status === 'fulfilled') setDashboardStats(statsRes.value);
      if (patRes.status === 'fulfilled') setPatients(patRes.value);
      if (docRes.status === 'fulfilled') setDoctors(docRes.value);
      if (appRes.status === 'fulfilled') setAppointments(appRes.value);
      if (recRes.status === 'fulfilled') setMedicalRecords(recRes.value);
      if (billRes.status === 'fulfilled') setInvoices(billRes.value);
      if (dbRes.status === 'fulfilled') setDbStatus(dbRes.value);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    showToast('Data synced with JDBC database', 'info');
  };

  // Patient CRUD Handlers
  const handleSearchPatients = async (query) => {
    try {
      const data = await api.getPatients(query);
      setPatients(data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCreatePatient = async (patientData) => {
    try {
      const created = await api.createPatient(patientData);
      showToast(`Patient "${created.name}" registered successfully!`, 'success');
      await loadData();
      return created;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleUpdatePatient = async (id, patientData) => {
    try {
      const updated = await api.updatePatient(id, patientData);
      showToast(`Patient "${updated.name}" updated successfully!`, 'success');
      await loadData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      await api.deletePatient(id);
      showToast('Patient record deleted successfully!', 'success');
      await loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Doctor CRUD Handlers
  const handleCreateDoctor = async (docData) => {
    try {
      const created = await api.createDoctor(docData);
      showToast(`Doctor "${created.name}" added to staff!`, 'success');
      await loadData();
      return created;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleUpdateDoctor = async (id, docData) => {
    try {
      const updated = await api.updateDoctor(id, docData);
      showToast(`Doctor "${updated.name}" updated!`, 'success');
      await loadData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await api.deleteDoctor(id);
      showToast('Doctor deleted successfully!', 'success');
      await loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Appointment CRUD Handlers
  const handleCreateAppointment = async (appData) => {
    try {
      const created = await api.createAppointment(appData);
      showToast('Appointment booked successfully!', 'success');
      await loadData();
      return created;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleUpdateAppointment = async (id, appData) => {
    try {
      const updated = await api.updateAppointment(id, appData);
      showToast('Appointment updated successfully!', 'success');
      await loadData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      await api.updateAppointmentStatus(id, status);
      showToast(`Appointment status updated to ${status}!`, 'info');
      await loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await api.deleteAppointment(id);
      showToast('Appointment deleted successfully!', 'success');
      await loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Medical Record CRUD Handlers
  const handleCreateMedicalRecord = async (recData) => {
    try {
      const created = await api.createMedicalRecord(recData);
      showToast('Medical record & prescription saved!', 'success');
      await loadData();
      return created;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleUpdateMedicalRecord = async (id, recData) => {
    try {
      const updated = await api.updateMedicalRecord(id, recData);
      showToast('Medical record updated!', 'success');
      await loadData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleDeleteMedicalRecord = async (id) => {
    try {
      await api.deleteMedicalRecord(id);
      showToast('Medical record deleted!', 'success');
      await loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Billing CRUD Handlers
  const handleCreateInvoice = async (invData) => {
    try {
      const created = await api.createInvoice(invData);
      showToast('Invoice generated successfully!', 'success');
      await loadData();
      return created;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleUpdateInvoice = async (id, invData) => {
    try {
      const updated = await api.updateInvoice(id, invData);
      showToast('Invoice updated successfully!', 'success');
      await loadData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleUpdateInvoiceStatus = async (id, status) => {
    try {
      await api.updateInvoiceStatus(id, status);
      showToast(`Payment status updated to ${status}!`, 'info');
      await loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteInvoice = async (id) => {
    try {
      await api.deleteInvoice(id);
      showToast('Invoice deleted successfully!', 'success');
      await loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // DB Reconnect Handler
  const handleReconnectDb = async (config) => {
    try {
      const res = await api.reconnectDatabase(config);
      setDbStatus(res);
      await loadData();
      return res;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleQuickAction = (action) => {
    if (action === 'patient') setActiveTab('patients');
    if (action === 'doctor') setActiveTab('doctors');
    if (action === 'appointment') setActiveTab('appointments');
    if (action === 'record') setActiveTab('records');
    if (action === 'billing') setActiveTab('billing');
  };

  return (
    <div className="flex min-h-screen bg-slate-100/60 font-sans antialiased text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbStatus={dbStatus}
        onOpenDbModal={() => setIsDbModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          dbStatus={dbStatus}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onOpenQuickAction={handleQuickAction}
          onOpenDbModal={() => setIsDbModalOpen(true)}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={dashboardStats}
              loading={loading}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenQuickAction={handleQuickAction}
              onStatusUpdate={handleUpdateAppointmentStatus}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              loading={loading}
              onSearch={handleSearchPatients}
              onCreate={handleCreatePatient}
              onUpdate={handleUpdatePatient}
              onDelete={handleDeletePatient}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'doctors' && (
            <DoctorsView
              doctors={doctors}
              loading={loading}
              onCreate={handleCreateDoctor}
              onUpdate={handleUpdateDoctor}
              onDelete={handleDeleteDoctor}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              patients={patients}
              doctors={doctors}
              loading={loading}
              onCreate={handleCreateAppointment}
              onUpdate={handleUpdateAppointment}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onDelete={handleDeleteAppointment}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'records' && (
            <MedicalRecordsView
              records={medicalRecords}
              patients={patients}
              doctors={doctors}
              loading={loading}
              onCreate={handleCreateMedicalRecord}
              onUpdate={handleUpdateMedicalRecord}
              onDelete={handleDeleteMedicalRecord}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'billing' && (
            <BillingView
              invoices={invoices}
              patients={patients}
              appointments={appointments}
              loading={loading}
              onCreate={handleCreateInvoice}
              onUpdate={handleUpdateInvoice}
              onUpdateStatus={handleUpdateInvoiceStatus}
              onDelete={handleDeleteInvoice}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Database Settings Modal */}
      <DatabaseSettingsModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        dbStatus={dbStatus}
        onReconnect={handleReconnectDb}
        onShowToast={showToast}
      />

      {/* Toast Feedback */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
