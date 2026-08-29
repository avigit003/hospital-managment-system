package com.hospital.dao;

import com.hospital.config.DatabaseConfig;
import com.hospital.model.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AppointmentDAO {

    @Autowired
    private DatabaseConfig dbConfig;

    // CREATE (Book Appointment)
    public Appointment create(Appointment a) throws SQLException {
        String sql = "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, reason, notes) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, a.getPatientId());
            ps.setInt(2, a.getDoctorId());
            ps.setString(3, a.getAppointmentDate());
            ps.setString(4, a.getAppointmentTime());
            ps.setString(5, a.getStatus() != null ? a.getStatus() : "SCHEDULED");
            ps.setString(6, a.getReason());
            ps.setString(7, a.getNotes());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        a.setId(rs.getInt(1));
                    }
                }
            }
            return findById(a.getId());
        }
    }

    // READ (Find All with Joined Patient and Doctor info)
    public List<Appointment> findAll() throws SQLException {
        List<Appointment> list = new ArrayList<>();
        String sql = "SELECT a.*, p.name AS patient_name, p.contact AS patient_contact, " +
                     "d.name AS doctor_name, d.specialization AS doctor_specialization " +
                     "FROM appointments a " +
                     "LEFT JOIN patients p ON a.patient_id = p.id " +
                     "LEFT JOIN doctors d ON a.doctor_id = d.id " +
                     "ORDER BY a.appointment_date DESC, a.appointment_time DESC";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToAppointment(rs));
            }
        }
        return list;
    }

    // READ (Find by ID)
    public Appointment findById(int id) throws SQLException {
        String sql = "SELECT a.*, p.name AS patient_name, p.contact AS patient_contact, " +
                     "d.name AS doctor_name, d.specialization AS doctor_specialization " +
                     "FROM appointments a " +
                     "LEFT JOIN patients p ON a.patient_id = p.id " +
                     "LEFT JOIN doctors d ON a.doctor_id = d.id " +
                     "WHERE a.id = ?";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToAppointment(rs);
                }
            }
        }
        return null;
    }

    // UPDATE (Edit full appointment)
    public boolean update(Appointment a) throws SQLException {
        String sql = "UPDATE appointments SET patient_id = ?, doctor_id = ?, appointment_date = ?, " +
                     "appointment_time = ?, status = ?, reason = ?, notes = ? WHERE id = ?";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, a.getPatientId());
            ps.setInt(2, a.getDoctorId());
            ps.setString(3, a.getAppointmentDate());
            ps.setString(4, a.getAppointmentTime());
            ps.setString(5, a.getStatus());
            ps.setString(6, a.getReason());
            ps.setString(7, a.getNotes());
            ps.setInt(8, a.getId());

            return ps.executeUpdate() > 0;
        }
    }

    // UPDATE STATUS
    public boolean updateStatus(int id, String status) throws SQLException {
        String sql = "UPDATE appointments SET status = ? WHERE id = ?";
        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, status);
            ps.setInt(2, id);

            return ps.executeUpdate() > 0;
        }
    }

    // DELETE
    public boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM appointments WHERE id = ?";
        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private Appointment mapResultSetToAppointment(ResultSet rs) throws SQLException {
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
        return a;
    }
}
