package com.hospital.dao;

import com.hospital.config.DatabaseConfig;
import com.hospital.model.Appointment;
import com.hospital.model.DashboardStats;
import com.hospital.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class DashboardDAO {

    @Autowired
    private DatabaseConfig dbConfig;

    public DashboardStats getStats() throws SQLException {
        DashboardStats stats = new DashboardStats();
        String today = LocalDate.now().toString();

        try (Connection conn = dbConfig.getConnection()) {
            // Total Patients
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM patients")) {
                if (rs.next()) stats.setTotalPatients(rs.getInt(1));
            }

            // Total Doctors
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM doctors")) {
                if (rs.next()) stats.setTotalDoctors(rs.getInt(1));
            }

            // Total Appointments
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM appointments")) {
                if (rs.next()) stats.setTotalAppointments(rs.getInt(1));
            }

            // Today Appointments
            try (PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) FROM appointments WHERE appointment_date = ?")) {
                ps.setString(1, today);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) stats.setTodayAppointments(rs.getInt(1));
                }
            }

            // Pending Appointments
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM appointments WHERE status = 'SCHEDULED'")) {
                if (rs.next()) stats.setPendingAppointments(rs.getInt(1));
            }

            // Completed Appointments
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM appointments WHERE status = 'COMPLETED'")) {
                if (rs.next()) stats.setCompletedAppointments(rs.getInt(1));
            }

            // Total Paid Revenue
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT COALESCE(SUM(total_amount), 0) FROM billing WHERE payment_status = 'PAID'")) {
                if (rs.next()) stats.setTotalRevenue(rs.getDouble(1));
            }

            // Total Pending Revenue
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT COALESCE(SUM(total_amount), 0) FROM billing WHERE payment_status = 'PENDING'")) {
                if (rs.next()) stats.setPendingRevenue(rs.getDouble(1));
            }

            // Recent Appointments (Top 5)
            List<Appointment> recentApps = new ArrayList<>();
            String appSql = "SELECT a.*, p.name AS patient_name, p.contact AS patient_contact, " +
                            "d.name AS doctor_name, d.specialization AS doctor_specialization " +
                            "FROM appointments a " +
                            "LEFT JOIN patients p ON a.patient_id = p.id " +
                            "LEFT JOIN doctors d ON a.doctor_id = d.id " +
                            "ORDER BY a.id DESC LIMIT 5";
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery(appSql)) {
                while (rs.next()) {
                    Appointment a = new Appointment(
                            rs.getInt("id"),
                            rs.getInt("patient_id"),
                            rs.getInt("doctor_id"),
                            rs.getString("appointment_date"),
                            rs.getString("appointment_time"),
                            rs.getString("status"),
                            rs.getString("reason"),
                            rs.getString("notes")
                    );
                    a.setPatientName(rs.getString("patient_name"));
                    a.setPatientContact(rs.getString("patient_contact"));
                    a.setDoctorName(rs.getString("doctor_name"));
                    a.setDoctorSpecialization(rs.getString("doctor_specialization"));
                    recentApps.add(a);
                }
            }
            stats.setRecentAppointments(recentApps);

            // Recent Patients (Top 5)
            List<Patient> recentPats = new ArrayList<>();
            String patSql = "SELECT * FROM patients ORDER BY id DESC LIMIT 5";
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery(patSql)) {
                while (rs.next()) {
                    Patient p = new Patient(
                            rs.getInt("id"),
                            rs.getString("name"),
                            rs.getInt("age"),
                            rs.getString("gender"),
                            rs.getString("blood_group"),
                            rs.getString("contact"),
                            rs.getString("email"),
                            rs.getString("address"),
                            rs.getString("medical_history"),
                            rs.getString("created_at")
                    );
                    recentPats.add(p);
                }
            }
            stats.setRecentPatients(recentPats);
        }

        return stats;
    }
}
