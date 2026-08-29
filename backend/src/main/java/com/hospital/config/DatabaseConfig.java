package com.hospital.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;

@Component
public class DatabaseConfig {

    @Value("${hospital.db.type:mysql}")
    private String preferredType;

    @Value("${hospital.db.mysql.url:jdbc:mysql://localhost:3306/hospital_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String mysqlUrl;

    @Value("${hospital.db.mysql.user:root}")
    private String mysqlUser;

    @Value("${hospital.db.mysql.password:root}")
    private String mysqlPassword;

    @Value("${hospital.db.sqlite.url:jdbc:sqlite:hospital.db}")
    private String sqliteUrl;

    private String activeDbType = "UNKNOWN";
    private String activeDbUrl = "";
    private String lastConnectionError = null;
    private boolean isConnected = false;

    @PostConstruct
    public void init() {
        initializeDatabase();
    }

    public synchronized void initializeDatabase() {
        // Try preferred database first
        if ("mysql".equalsIgnoreCase(preferredType)) {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                try (Connection conn = DriverManager.getConnection(mysqlUrl, mysqlUser, mysqlPassword)) {
                    this.activeDbType = "MySQL 8.0";
                    this.activeDbUrl = mysqlUrl;
                    this.isConnected = true;
                    this.lastConnectionError = null;
                    System.out.println(">>> [JDBC] Successfully connected to MySQL Database!");
                    createTables(conn);
                    seedInitialData(conn);
                    return;
                }
            } catch (Exception e) {
                System.err.println(">>> [JDBC] Could not connect to MySQL (" + e.getMessage() + "). Falling back to SQLite JDBC...");
                this.lastConnectionError = "MySQL: " + e.getMessage();
            }
        }

        // Fallback or explicit SQLite
        try {
            Class.forName("org.sqlite.JDBC");
            try (Connection conn = DriverManager.getConnection(sqliteUrl)) {
                this.activeDbType = "SQLite (Zero-Config)";
                this.activeDbUrl = sqliteUrl;
                this.isConnected = true;
                System.out.println(">>> [JDBC] Successfully connected to SQLite Database at " + sqliteUrl);
                createTables(conn);
                seedInitialData(conn);
            }
        } catch (Exception e) {
            System.err.println(">>> [JDBC] Failed to initialize SQLite: " + e.getMessage());
            this.isConnected = false;
            this.lastConnectionError = e.getMessage();
        }
    }

    public Connection getConnection() throws SQLException {
        if ("MySQL 8.0".equals(activeDbType)) {
            return DriverManager.getConnection(mysqlUrl, mysqlUser, mysqlPassword);
        } else {
            return DriverManager.getConnection(sqliteUrl);
        }
    }

    public synchronized boolean reconfigure(String type, String host, int port, String dbName, String user, String password) {
        if ("mysql".equalsIgnoreCase(type)) {
            String newUrl = "jdbc:mysql://" + host + ":" + port + "/" + dbName + "?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                try (Connection conn = DriverManager.getConnection(newUrl, user, password)) {
                    this.preferredType = "mysql";
                    this.mysqlUrl = newUrl;
                    this.mysqlUser = user;
                    this.mysqlPassword = password;
                    this.activeDbType = "MySQL 8.0";
                    this.activeDbUrl = newUrl;
                    this.isConnected = true;
                    this.lastConnectionError = null;
                    createTables(conn);
                    seedInitialData(conn);
                    return true;
                }
            } catch (Exception e) {
                this.lastConnectionError = e.getMessage();
                return false;
            }
        } else {
            this.preferredType = "sqlite";
            this.activeDbType = "SQLite (Zero-Config)";
            this.activeDbUrl = sqliteUrl;
            try {
                try (Connection conn = DriverManager.getConnection(sqliteUrl)) {
                    this.isConnected = true;
                    this.lastConnectionError = null;
                    createTables(conn);
                    return true;
                }
            } catch (Exception e) {
                this.lastConnectionError = e.getMessage();
                return false;
            }
        }
    }

    private void createTables(Connection conn) throws SQLException {
        boolean isSqlite = activeDbType.startsWith("SQLite");
        String autoInc = isSqlite ? "INTEGER PRIMARY KEY AUTOINCREMENT" : "INT PRIMARY KEY AUTO_INCREMENT";

        try (Statement stmt = conn.createStatement()) {
            // Patients table
            String createPatients = "CREATE TABLE IF NOT EXISTS patients (" +
                    "id " + autoInc + ", " +
                    "name VARCHAR(100) NOT NULL, " +
                    "age INT NOT NULL, " +
                    "gender VARCHAR(20) NOT NULL, " +
                    "blood_group VARCHAR(10), " +
                    "contact VARCHAR(20) NOT NULL, " +
                    "email VARCHAR(100), " +
                    "address TEXT, " +
                    "medical_history TEXT, " +
                    "created_at VARCHAR(50)" +
                    ");";
            stmt.execute(createPatients);

            // Doctors table
            String createDoctors = "CREATE TABLE IF NOT EXISTS doctors (" +
                    "id " + autoInc + ", " +
                    "name VARCHAR(100) NOT NULL, " +
                    "specialization VARCHAR(100) NOT NULL, " +
                    "qualification VARCHAR(100), " +
                    "experience_years INT DEFAULT 0, " +
                    "phone VARCHAR(20), " +
                    "email VARCHAR(100), " +
                    "consultation_fee DOUBLE DEFAULT 0.0, " +
                    "available_days VARCHAR(100), " +
                    "available_time VARCHAR(100), " +
                    "status VARCHAR(20) DEFAULT 'ACTIVE'" +
                    ");";
            stmt.execute(createDoctors);

            // Appointments table
            String createAppointments = "CREATE TABLE IF NOT EXISTS appointments (" +
                    "id " + autoInc + ", " +
                    "patient_id INT NOT NULL, " +
                    "doctor_id INT NOT NULL, " +
                    "appointment_date VARCHAR(30) NOT NULL, " +
                    "appointment_time VARCHAR(30) NOT NULL, " +
                    "status VARCHAR(30) DEFAULT 'SCHEDULED', " +
                    "reason TEXT, " +
                    "notes TEXT" +
                    ");";
            stmt.execute(createAppointments);

            // Billing table
            String createBilling = "CREATE TABLE IF NOT EXISTS billing (" +
                    "id " + autoInc + ", " +
                    "patient_id INT NOT NULL, " +
                    "appointment_id INT, " +
                    "consultation_fee DOUBLE DEFAULT 0.0, " +
                    "medicine_fee DOUBLE DEFAULT 0.0, " +
                    "test_fee DOUBLE DEFAULT 0.0, " +
                    "other_charges DOUBLE DEFAULT 0.0, " +
                    "total_amount DOUBLE NOT NULL, " +
                    "payment_status VARCHAR(30) DEFAULT 'PENDING', " +
                    "payment_mode VARCHAR(30) DEFAULT 'CASH', " +
                    "billing_date VARCHAR(30) NOT NULL, " +
                    "notes TEXT" +
                    ");";
            stmt.execute(createBilling);

            // Medical Records table
            String createMedicalRecords = "CREATE TABLE IF NOT EXISTS medical_records (" +
                    "id " + autoInc + ", " +
                    "patient_id INT NOT NULL, " +
                    "doctor_id INT, " +
                    "diagnosis VARCHAR(200) NOT NULL, " +
                    "symptoms TEXT, " +
                    "prescription TEXT, " +
                    "treatment_plan TEXT, " +
                    "visit_date VARCHAR(30) NOT NULL, " +
                    "notes TEXT" +
                    ");";
            stmt.execute(createMedicalRecords);

            System.out.println(">>> [JDBC] All Hospital tables checked/created successfully.");
        }
    }

    private void seedInitialData(Connection conn) {
        try (Statement stmt = conn.createStatement()) {
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM doctors");
            if (rs.next() && rs.getInt(1) == 0) {
                System.out.println(">>> [JDBC] Seeding initial sample data...");

                // Seed Doctors
                String insertDoctors = "INSERT INTO doctors (name, specialization, qualification, experience_years, phone, email, consultationFee, available_days, available_time, status) VALUES " +
                        "('Dr. Sarah Jenkins', 'Cardiology', 'MD, FACC', 14, '+1 (555) 234-5678', 's.jenkins@hospital.org', 150.00, 'Mon, Wed, Fri', '09:00 AM - 02:00 PM', 'ACTIVE')," +
                        "('Dr. Michael Chang', 'Neurology', 'MD, PhD', 11, '+1 (555) 345-6789', 'm.chang@hospital.org', 180.00, 'Tue, Thu, Sat', '10:00 AM - 04:00 PM', 'ACTIVE')," +
                        "('Dr. Emily Rodriguez', 'Pediatrics', 'MD, FAAP', 9, '+1 (555) 456-7890', 'e.rodriguez@hospital.org', 120.00, 'Mon, Tue, Wed, Thu', '08:30 AM - 01:30 PM', 'ACTIVE')," +
                        "('Dr. James Wilson', 'Orthopedics', 'MS, FRCS', 16, '+1 (555) 567-8901', 'j.wilson@hospital.org', 160.00, 'Mon, Wed, Thu', '11:00 AM - 05:00 PM', 'ACTIVE')," +
                        "('Dr. Priya Sharma', 'General Medicine', 'MBBS, MD', 8, '+1 (555) 678-9012', 'p.sharma@hospital.org', 90.00, 'Mon - Fri', '09:00 AM - 05:00 PM', 'ACTIVE');";
                
                // SQLite uses consultation_fee vs consultationFee
                insertDoctors = insertDoctors.replace("consultationFee", "consultation_fee");
                stmt.execute(insertDoctors);

                // Seed Patients
                String insertPatients = "INSERT INTO patients (name, age, gender, blood_group, contact, email, address, medical_history, created_at) VALUES " +
                        "('Robert Davis', 45, 'Male', 'O+', '+1 (555) 111-2233', 'robert.davis@example.com', '124 Maple Street, Springfield', 'Hypertension, Mild Asthma', '2026-08-20')," +
                        "('Amanda Lewis', 32, 'Female', 'A+', '+1 (555) 222-3344', 'amanda.lewis@example.com', '782 Oak Avenue, Metroville', 'None reported', '2026-08-22')," +
                        "('David Miller', 58, 'Male', 'B-', '+1 (555) 333-4455', 'david.miller@example.com', '45 Pine Lane, Springfield', 'Type 2 Diabetes, High Cholesterol', '2026-08-25')," +
                        "('Sophia Taylor', 24, 'Female', 'AB+', '+1 (555) 444-5566', 'sophia.t@example.com', '910 Birch Road, Springfield', 'Penicillin Allergy', '2026-08-27')," +
                        "('William Brown', 67, 'Male', 'O-', '+1 (555) 555-6677', 'w.brown@example.com', '303 Elm Court, Metroville', 'Post-cardiac bypass (2024)', '2026-08-28');";
                stmt.execute(insertPatients);

                // Seed Appointments
                String insertAppointments = "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, reason, notes) VALUES " +
                        "(1, 1, '2026-08-30', '10:00 AM', 'SCHEDULED', 'Routine cardiac checkup and BP review', 'Patient requested morning slot')," +
                        "(2, 3, '2026-08-30', '11:30 AM', 'SCHEDULED', 'Child vaccination and general checkup', 'Follow-up from last month')," +
                        "(3, 5, '2026-08-29', '02:00 PM', 'COMPLETED', 'Fever, cough and fatigue consultation', 'Prescribed antibiotics and rest')," +
                        "(4, 2, '2026-08-31', '03:15 PM', 'SCHEDULED', 'Migraine & persistent headaches evaluation', 'First visit')," +
                        "(5, 4, '2026-08-28', '01:00 PM', 'COMPLETED', 'Knee joint pain & mobility assessment', 'X-ray advised');";
                stmt.execute(insertAppointments);

                // Seed Medical Records
                String insertRecords = "INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, prescription, treatment_plan, visit_date, notes) VALUES " +
                        "(3, 5, 'Acute Upper Respiratory Infection', 'Fever 101F, dry cough, throat irritation', 'Amoxicillin 500mg (3x daily for 5 days), Paracetamol 650mg as needed, Cough syrup 10ml TDS', 'Hydration, warm saline gargle, 4 days bed rest', '2026-08-29', 'Patient advised to return if fever persists past 3 days.')," +
                        "(5, 4, 'Mild Osteoarthritis - Right Knee', 'Pain on walking, slight joint stiffness in morning', 'Glucosamine Sulfate 500mg, Ibuprofen 400mg PRN', 'Low impact physical therapy, weight bearing exercises avoided', '2026-08-28', 'Review in 4 weeks with X-Ray reports.');";
                stmt.execute(insertRecords);

                // Seed Billing
                String insertBilling = "INSERT INTO billing (patient_id, appointment_id, consultation_fee, medicine_fee, test_fee, other_charges, total_amount, payment_status, payment_mode, billing_date, notes) VALUES " +
                        "(3, 3, 90.00, 35.50, 45.00, 10.00, 180.50, 'PAID', 'UPI', '2026-08-29', 'Full payment received at counter')," +
                        "(5, 5, 160.00, 45.00, 120.00, 15.00, 340.00, 'PAID', 'CARD', '2026-08-28', 'Card ending in 4092')," +
                        "(1, 1, 150.00, 0.00, 80.00, 0.00, 230.00, 'PENDING', 'INSURANCE', '2026-08-29', 'Pending insurance pre-auth approval');";
                stmt.execute(insertBilling);

                System.out.println(">>> [JDBC] Sample data seeded successfully!");
            }
        } catch (Exception e) {
            System.err.println(">>> [JDBC] Note on seeding data: " + e.getMessage());
        }
    }

    public Map<String, Object> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("activeDbType", activeDbType);
        status.put("activeDbUrl", activeDbUrl);
        status.put("connected", isConnected);
        status.put("lastError", lastConnectionError);
        status.put("driver", activeDbType.startsWith("MySQL") ? "com.mysql.cj.jdbc.Driver" : "org.sqlite.JDBC");
        return status;
    }
}
