package com.hospital.dao;

import com.hospital.config.DatabaseConfig;
import com.hospital.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PatientDAO {

    @Autowired
    private DatabaseConfig dbConfig;

    // CREATE (Register Patient)
    public Patient create(Patient p) throws SQLException {
        String sql = "INSERT INTO patients (name, age, gender, blood_group, contact, email, address, medical_history, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        String now = p.getCreatedAt() != null && !p.getCreatedAt().isEmpty() ? p.getCreatedAt() : LocalDate.now().toString();

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setString(1, p.getName());
            ps.setInt(2, p.getAge());
            ps.setString(3, p.getGender());
            ps.setString(4, p.getBloodGroup());
            ps.setString(5, p.getContact());
            ps.setString(6, p.getEmail());
            ps.setString(7, p.getAddress());
            ps.setString(8, p.getMedicalHistory());
            ps.setString(9, now);

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        p.setId(rs.getInt(1));
                    }
                }
            }
            p.setCreatedAt(now);
            return p;
        }
    }

    // READ (Find All Patients)
    public List<Patient> findAll() throws SQLException {
        List<Patient> list = new ArrayList<>();
        String sql = "SELECT * FROM patients ORDER BY id DESC";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToPatient(rs));
            }
        }
        return list;
    }

    // READ (Find By ID)
    public Patient findById(int id) throws SQLException {
        String sql = "SELECT * FROM patients WHERE id = ?";
        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToPatient(rs);
                }
            }
        }
        return null;
    }

    // READ (Search Patients by Name, Contact or Blood Group)
    public List<Patient> search(String query) throws SQLException {
        List<Patient> list = new ArrayList<>();
        String sql = "SELECT * FROM patients WHERE name LIKE ? OR contact LIKE ? OR email LIKE ? OR blood_group LIKE ? ORDER BY id DESC";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            String term = "%" + query + "%";
            ps.setString(1, term);
            ps.setString(2, term);
            ps.setString(3, term);
            ps.setString(4, term);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToPatient(rs));
                }
            }
        }
        return list;
    }

    // UPDATE (Edit Patient Information)
    public boolean update(Patient p) throws SQLException {
        String sql = "UPDATE patients SET name = ?, age = ?, gender = ?, blood_group = ?, contact = ?, " +
                     "email = ?, address = ?, medical_history = ? WHERE id = ?";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, p.getName());
            ps.setInt(2, p.getAge());
            ps.setString(3, p.getGender());
            ps.setString(4, p.getBloodGroup());
            ps.setString(5, p.getContact());
            ps.setString(6, p.getEmail());
            ps.setString(7, p.getAddress());
            ps.setString(8, p.getMedicalHistory());
            ps.setInt(9, p.getId());

            return ps.executeUpdate() > 0;
        }
    }

    // DELETE (Remove Patient & cascade related)
    public boolean delete(int id) throws SQLException {
        try (Connection conn = dbConfig.getConnection()) {
            conn.setAutoCommit(false);
            try {
                // Delete related records
                try (PreparedStatement psRec = conn.prepareStatement("DELETE FROM medical_records WHERE patient_id = ?")) {
                    psRec.setInt(1, id);
                    psRec.executeUpdate();
                }
                try (PreparedStatement psBill = conn.prepareStatement("DELETE FROM billing WHERE patient_id = ?")) {
                    psBill.setInt(1, id);
                    psBill.executeUpdate();
                }
                try (PreparedStatement psApp = conn.prepareStatement("DELETE FROM appointments WHERE patient_id = ?")) {
                    psApp.setInt(1, id);
                    psApp.executeUpdate();
                }
                // Delete patient
                int affected;
                try (PreparedStatement psPat = conn.prepareStatement("DELETE FROM patients WHERE id = ?")) {
                    psPat.setInt(1, id);
                    affected = psPat.executeUpdate();
                }

                conn.commit();
                return affected > 0;
            } catch (SQLException ex) {
                conn.rollback();
                throw ex;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }

    private Patient mapResultSetToPatient(ResultSet rs) throws SQLException {
        return new Patient(
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
    }
}
