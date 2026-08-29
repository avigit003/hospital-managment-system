-- ============================================================
-- Hospital Management System (CareSync) Database Schema
-- Compatible with MySQL 8.0 & JDBC
-- ============================================================

CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    contact VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    medical_history TEXT,
    created_at VARCHAR(50)
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100),
    experience_years INT DEFAULT 0,
    phone VARCHAR(20),
    email VARCHAR(100),
    consultation_fee DOUBLE DEFAULT 0.0,
    available_days VARCHAR(100),
    available_time VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date VARCHAR(30) NOT NULL,
    appointment_time VARCHAR(30) NOT NULL,
    status VARCHAR(30) DEFAULT 'SCHEDULED',
    reason TEXT,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- 4. Billing Table
CREATE TABLE IF NOT EXISTS billing (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    appointment_id INT,
    consultation_fee DOUBLE DEFAULT 0.0,
    medicine_fee DOUBLE DEFAULT 0.0,
    test_fee DOUBLE DEFAULT 0.0,
    other_charges DOUBLE DEFAULT 0.0,
    total_amount DOUBLE NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'PENDING',
    payment_mode VARCHAR(30) DEFAULT 'CASH',
    billing_date VARCHAR(30) NOT NULL,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 5. Medical Records & Prescriptions Table
CREATE TABLE IF NOT EXISTS medical_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT,
    diagnosis VARCHAR(200) NOT NULL,
    symptoms TEXT,
    prescription TEXT,
    treatment_plan TEXT,
    visit_date VARCHAR(30) NOT NULL,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Sample Data Seeding
INSERT INTO doctors (name, specialization, qualification, experience_years, phone, email, consultation_fee, available_days, available_time, status) VALUES 
('Dr. Sarah Jenkins', 'Cardiology', 'MD, FACC', 14, '+1 (555) 234-5678', 's.jenkins@hospital.org', 150.00, 'Mon, Wed, Fri', '09:00 AM - 02:00 PM', 'ACTIVE'),
('Dr. Michael Chang', 'Neurology', 'MD, PhD', 11, '+1 (555) 345-6789', 'm.chang@hospital.org', 180.00, 'Tue, Thu, Sat', '10:00 AM - 04:00 PM', 'ACTIVE'),
('Dr. Emily Rodriguez', 'Pediatrics', 'MD, FAAP', 9, '+1 (555) 456-7890', 'e.rodriguez@hospital.org', 120.00, 'Mon, Tue, Wed, Thu', '08:30 AM - 01:30 PM', 'ACTIVE'),
('Dr. James Wilson', 'Orthopedics', 'MS, FRCS', 16, '+1 (555) 567-8901', 'j.wilson@hospital.org', 160.00, 'Mon, Wed, Thu', '11:00 AM - 05:00 PM', 'ACTIVE'),
('Dr. Priya Sharma', 'General Medicine', 'MBBS, MD', 8, '+1 (555) 678-9012', 'p.sharma@hospital.org', 90.00, 'Mon - Fri', '09:00 AM - 05:00 PM', 'ACTIVE');

INSERT INTO patients (name, age, gender, blood_group, contact, email, address, medical_history, created_at) VALUES 
('Robert Davis', 45, 'Male', 'O+', '+1 (555) 111-2233', 'robert.davis@example.com', '124 Maple Street, Springfield', 'Hypertension, Mild Asthma', '2026-08-20'),
('Amanda Lewis', 32, 'Female', 'A+', '+1 (555) 222-3344', 'amanda.lewis@example.com', '782 Oak Avenue, Metroville', 'None reported', '2026-08-22'),
('David Miller', 58, 'Male', 'B-', '+1 (555) 333-4455', 'david.miller@example.com', '45 Pine Lane, Springfield', 'Type 2 Diabetes, High Cholesterol', '2026-08-25'),
('Sophia Taylor', 24, 'Female', 'AB+', '+1 (555) 444-5566', 'sophia.t@example.com', '910 Birch Road, Springfield', 'Penicillin Allergy', '2026-08-27'),
('William Brown', 67, 'Male', 'O-', '+1 (555) 555-6677', 'w.brown@example.com', '303 Elm Court, Metroville', 'Post-cardiac bypass (2024)', '2026-08-28');
