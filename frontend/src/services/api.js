const API_BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const data = await res.json();
      if (data && data.error) errorMsg = data.error;
      else if (data && data.message) errorMsg = data.message;
    } catch {
      errorMsg = `${res.status} ${res.statusText}`;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Dashboard
  getDashboardStats: () => fetch(`${API_BASE}/dashboard/stats`).then(handleResponse),

  // Patients
  getPatients: (search = '') => {
    const url = search ? `${API_BASE}/patients?search=${encodeURIComponent(search)}` : `${API_BASE}/patients`;
    return fetch(url).then(handleResponse);
  },
  getPatientById: (id) => fetch(`${API_BASE}/patients/${id}`).then(handleResponse),
  createPatient: (patient) =>
    fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    }).then(handleResponse),
  updatePatient: (id, patient) =>
    fetch(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    }).then(handleResponse),
  deletePatient: (id) =>
    fetch(`${API_BASE}/patients/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Doctors
  getDoctors: () => fetch(`${API_BASE}/doctors`).then(handleResponse),
  getDoctorById: (id) => fetch(`${API_BASE}/doctors/${id}`).then(handleResponse),
  createDoctor: (doctor) =>
    fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor),
    }).then(handleResponse),
  updateDoctor: (id, doctor) =>
    fetch(`${API_BASE}/doctors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor),
    }).then(handleResponse),
  deleteDoctor: (id) =>
    fetch(`${API_BASE}/doctors/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Appointments
  getAppointments: () => fetch(`${API_BASE}/appointments`).then(handleResponse),
  getAppointmentById: (id) => fetch(`${API_BASE}/appointments/${id}`).then(handleResponse),
  createAppointment: (appointment) =>
    fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    }).then(handleResponse),
  updateAppointment: (id, appointment) =>
    fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    }).then(handleResponse),
  updateAppointmentStatus: (id, status) =>
    fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(handleResponse),
  deleteAppointment: (id) =>
    fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Billing
  getInvoices: () => fetch(`${API_BASE}/billing`).then(handleResponse),
  getInvoiceById: (id) => fetch(`${API_BASE}/billing/${id}`).then(handleResponse),
  createInvoice: (invoice) =>
    fetch(`${API_BASE}/billing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    }).then(handleResponse),
  updateInvoice: (id, invoice) =>
    fetch(`${API_BASE}/billing/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    }).then(handleResponse),
  updateInvoiceStatus: (id, status) =>
    fetch(`${API_BASE}/billing/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(handleResponse),
  deleteInvoice: (id) =>
    fetch(`${API_BASE}/billing/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Medical Records
  getMedicalRecords: () => fetch(`${API_BASE}/medical-records`).then(handleResponse),
  getMedicalRecordsByPatient: (patientId) => fetch(`${API_BASE}/medical-records/patient/${patientId}`).then(handleResponse),
  createMedicalRecord: (record) =>
    fetch(`${API_BASE}/medical-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).then(handleResponse),
  updateMedicalRecord: (id, record) =>
    fetch(`${API_BASE}/medical-records/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).then(handleResponse),
  deleteMedicalRecord: (id) =>
    fetch(`${API_BASE}/medical-records/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // System & JDBC Status
  getSystemStatus: () => fetch(`${API_BASE}/system/status`).then(handleResponse),
  reconnectDatabase: (config) =>
    fetch(`${API_BASE}/system/reconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    }).then(handleResponse),
};
