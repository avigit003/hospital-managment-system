# 🏥 CareSync - Hospital Management System (JDBC + React)

A full-stack **Hospital Management System (HMS)** built with a high-performance **Java JDBC REST backend** and a modern, responsive **React + Tailwind CSS** frontend.

---

## 🌟 Key Features

### 👤 1. Patient Management (CRUD)
- **Register Patient**: Add patient demographics (Name, Age, Gender, Blood Group, Contact, Email, Address, Medical History/Allergies).
- **View & Search**: Search instantly by Name, Phone, Email, or Blood Group.
- **Patient Profile**: View detailed patient summary, history, and notes.
- **Update & Delete**: Edit patient details or safely delete records with database cascade.

### 🩺 2. Doctor & Staff Management (CRUD)
- **Add Doctor**: Name, Specialization, Qualifications, Experience, Contact, Consultation Fee, Available Days & Hours.
- **Filter & View**: Toggle between responsive Grid cards and Table roster. Filter by medical specialty (Cardiology, Neurology, Pediatrics, Orthopedics, General Medicine, etc.).
- **Edit & Remove**: Modify doctor schedules, fees, or status (Active, On Leave, Inactive).

### 📅 3. Appointment Scheduling (CRUD)
- **Book Appointments**: Select Patient and Doctor from live database records, pick date & time slots, and specify visit reasons.
- **Status Workflow**: Track statuses (`SCHEDULED`, `COMPLETED`, `CANCELLED`) with instant one-click status transitions.
- **Reschedule / Cancel**: Edit or delete scheduled visits.

### 💊 4. Medical Records & Prescriptions (CRUD)
- **Clinical Records**: Document diagnosis, presenting symptoms, prescription medications (Rx), and treatment plans.
- **Printable Prescriptions**: Generate official, printable prescription slips with doctor signature blocks.

### 💳 5. Billing & Invoicing (CRUD)
- **Itemized Invoices**: Track doctor consultation fees, pharmacy charges, laboratory test fees, and room/service charges.
- **Payment Statuses**: Manage `PAID`, `PENDING`, and `PARTIAL` payments across Cash, Card, UPI, and Insurance.
- **Printable Receipts**: Generate and print formatted tax invoices and cash receipts.

### 📊 6. Hospital Command Center & Analytics
- **Live KPI Cards**: Total Patients, Active Doctors, Today's Appointments, Paid Revenue, and Pending Collections.
- **Database Status Indicator**: Displays live JDBC connectivity, database engine, and connection URL.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Backend API** | Java (JDK 21/24), Spring Boot 3.3.4 REST APIs |
| **Database Access** | Pure JDBC (`java.sql.Connection`, `PreparedStatement`, `ResultSet`, `Statement`) |
| **Supported Databases** | MySQL 8.0 / SQLite (Zero-configuration fallback) |

---

## 🚀 How to Run the Application

### Option A: One-Click Start (Windows)
Double-click `start-all.bat` located in the root directory. It will:
1. Start the Java JDBC Backend on port `8080`
2. Start the React Frontend on port `5173`
3. Automatically open `http://localhost:5173` in your default browser

---

### Option B: Manual Start

#### 1. Start Java JDBC Backend
```bash
cd backend
"C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" spring-boot:run
```
*(Backend will run on `http://localhost:8080` and auto-initialize database tables and seed sample data)*

#### 2. Start React Frontend
```bash
cd frontend
npm run dev
```
*(Frontend will run on `http://localhost:5173`)*

---

## ⚙️ Database Configuration

Configuration is located in `backend/src/main/resources/application.properties`:
```properties
server.port=8080

# Preferred database (mysql or sqlite)
hospital.db.type=mysql
hospital.db.mysql.url=jdbc:mysql://localhost:3306/hospital_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
hospital.db.mysql.user=root
hospital.db.mysql.password=root

# SQLite Fallback / Standalone
hospital.db.sqlite.url=jdbc:sqlite:hospital.db
```

> **Note:** If MySQL credentials are not yet configured on your machine, the backend will automatically fallback to the embedded SQLite database so you can test all features immediately without any setup! You can also switch database configurations live anytime by clicking the **JDBC Database** badge in the UI.

---

## 📁 Project Structure

```
Hospital Managment System/
├── database_schema.sql         # SQL schema & initial data script
├── start-all.bat               # Master one-click startup script
├── run-backend.bat             # Backend launch script
├── run-frontend.bat            # Frontend launch script
├── README.md                   # Documentation
├── backend/                    # Java JDBC REST API
│   ├── pom.xml                 # Maven configuration
│   └── src/main/java/com/hospital/
│       ├── HospitalManagementApplication.java
│       ├── config/             # DatabaseConfig.java (JDBC init), CorsConfig.java
│       ├── model/              # Patient, Doctor, Appointment, Billing, MedicalRecord
│       ├── dao/                # PatientDAO, DoctorDAO, AppointmentDAO, BillingDAO, etc.
│       └── controller/         # REST Controllers
└── frontend/                   # React + Vite + Tailwind CSS UI
    ├── src/
    │   ├── App.jsx             # Main Application Component
    │   ├── services/api.js     # API Service Connector
    │   └── components/         # Dashboard, Patients, Doctors, Appointments, Billing, etc.
    ├── package.json
    └── vite.config.js
```
