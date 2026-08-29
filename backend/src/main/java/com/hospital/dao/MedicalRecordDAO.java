package com.hospital.dao;

import com.hospital.config.DatabaseConfig;
import com.hospital.model.MedicalRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MedicalRecordDAO {

    @Autowired
    private DatabaseConfig dbConfig;

    // CREATE
    public MedicalRecord create(MedicalRecord m) throws SQLException {
        String sql = "INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, prescription, treatment_plan, visit_date, notes) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        String date = m.getVisitDate() != null && !m.getVisitDate().isEmpty() ? m.getVisitDate() : LocalDate.now().toString();

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, m.getPatientId());
            if (m.getDoctorId() != null) {
                ps.setInt(2, m.getDoctorId());
            } else {
                ps.setNull(2, Types.INTEGER);
            }
            ps.setString(3, m.getDiagnosis());
            ps.setString(4, m.getSymptoms());
            ps.setString(5, m.getPrescription());
            ps.setString(6, m.getTreatmentPlan());
            ps.setString(7, date);
            ps.setString(8, m.getNotes());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        m.setId(rs.getInt(1));
                    }
                }
            }
            return findById(m.getId());
        }
    }

    // READ ALL
    public List<MedicalRecord> findAll() throws SQLException {
        List<MedicalRecord> list = new ArrayList<>();
        String sql = "SELECT m.*, p.name AS patient_name, d.name AS doctor_name, d.specialization AS doctor_specialization " +
                     "FROM medical_records m " +
                     "LEFT JOIN patients p ON m.patient_id = p.id " +
                     "LEFT JOIN doctors d ON m.doctor_id = d.id " +
                     "ORDER BY m.visit_date DESC, m.id DESC";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToRecord(rs));
            }
        }
        return list;
    }

    // READ BY PATIENT ID
    public List<MedicalRecord> findByPatientId(int patientId) throws SQLException {
        List<MedicalRecord> list = new ArrayList<>();
        String sql = "SELECT m.*, p.name AS patient_name, d.name AS doctor_name, d.specialization AS doctor_specialization " +
                     "FROM medical_records m " +
                     "LEFT JOIN patients p ON m.patient_id = p.id " +
                     "LEFT JOIN doctors d ON m.doctor_id = d.id " +
                     "WHERE m.patient_id = ? " +
                     "ORDER BY m.visit_date DESC";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, patientId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToRecord(rs));
                }
            }
        }
        return list;
    }

    // READ BY ID
    public MedicalRecord findById(int id) throws SQLException {
        String sql = "SELECT m.*, p.name AS patient_name, d.name AS doctor_name, d.specialization AS doctor_specialization " +
                     "FROM medical_records m " +
                     "LEFT JOIN patients p ON m.patient_id = p.id " +
                     "LEFT JOIN doctors d ON m.doctor_id = d.id " +
                     "WHERE m.id = ?";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToRecord(rs);
                }
            }
        }
        return null;
    }

    // UPDATE
    public boolean update(MedicalRecord m) throws SQLException {
        String sql = "UPDATE medical_records SET patient_id = ?, doctor_id = ?, diagnosis = ?, " +
                     "symptoms = ?, prescription = ?, treatment_plan = ?, visit_date = ?, notes = ? WHERE id = ?";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, m.getPatientId());
            if (m.getDoctorId() != null) {
                ps.setInt(2, m.getDoctorId());
            } else {
                ps.setNull(2, Types.INTEGER);
            }
            ps.setString(3, m.getDiagnosis());
            ps.setString(4, m.getSymptoms());
            ps.setString(5, m.getPrescription());
            ps.setString(6, m.getTreatmentPlan());
            ps.setString(7, m.getVisitDate());
            ps.setString(8, m.getNotes());
            ps.setInt(9, m.getId());

            return ps.executeUpdate() > 0;
        }
    }

    // DELETE
    public boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM medical_records WHERE id = ?";
        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private MedicalRecord mapResultSetToRecord(ResultSet rs) throws SQLException {
        MedicalRecord m = new MedicalRecord(
                rs.getInt("id"),
                rs.getInt("patient_id"),
                (Integer) rs.getObject("doctor_id"),
                rs.getString("diagnosis"),
                rs.getString("symptoms"),
                rs.getString("prescription"),
                rs.getString("treatment_plan"),
                rs.getString("visit_date"),
                rs.getString("notes")
        );
        m.setPatientName(rs.getString("patient_name"));
        m.setDoctorName(rs.getString("doctor_name"));
        m.setDoctorSpecialization(rs.getString("doctor_specialization"));
        return m;
    }
}
