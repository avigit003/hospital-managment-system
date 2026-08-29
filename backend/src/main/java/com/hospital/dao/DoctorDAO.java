package com.hospital.dao;

import com.hospital.config.DatabaseConfig;
import com.hospital.model.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class DoctorDAO {

    @Autowired
    private DatabaseConfig dbConfig;

    // CREATE (Add Doctor)
    public Doctor create(Doctor d) throws SQLException {
        String sql = "INSERT INTO doctors (name, specialization, qualification, experience_years, phone, email, consultation_fee, available_days, available_time, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, d.getName());
            ps.setString(2, d.getSpecialization());
            ps.setString(3, d.getQualification());
            ps.setInt(4, d.getExperienceYears());
            ps.setString(5, d.getPhone());
            ps.setString(6, d.getEmail());
            ps.setDouble(7, d.getConsultationFee());
            ps.setString(8, d.getAvailableDays());
            ps.setString(9, d.getAvailableTime());
            ps.setString(10, d.getStatus() != null ? d.getStatus() : "ACTIVE");

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        d.setId(rs.getInt(1));
                    }
                }
            }
            return d;
        }
    }

    // READ (Find All Doctors)
    public List<Doctor> findAll() throws SQLException {
        List<Doctor> list = new ArrayList<>();
        String sql = "SELECT * FROM doctors ORDER BY id ASC";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToDoctor(rs));
            }
        }
        return list;
    }

    // READ (Find By ID)
    public Doctor findById(int id) throws SQLException {
        String sql = "SELECT * FROM doctors WHERE id = ?";
        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToDoctor(rs);
                }
            }
        }
        return null;
    }

    // UPDATE (Edit Doctor details)
    public boolean update(Doctor d) throws SQLException {
        String sql = "UPDATE doctors SET name = ?, specialization = ?, qualification = ?, experience_years = ?, " +
                     "phone = ?, email = ?, consultation_fee = ?, available_days = ?, available_time = ?, status = ? WHERE id = ?";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, d.getName());
            ps.setString(2, d.getSpecialization());
            ps.setString(3, d.getQualification());
            ps.setInt(4, d.getExperienceYears());
            ps.setString(5, d.getPhone());
            ps.setString(6, d.getEmail());
            ps.setDouble(7, d.getConsultationFee());
            ps.setString(8, d.getAvailableDays());
            ps.setString(9, d.getAvailableTime());
            ps.setString(10, d.getStatus());
            ps.setInt(11, d.getId());

            return ps.executeUpdate() > 0;
        }
    }

    // DELETE (Delete Doctor)
    public boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM doctors WHERE id = ?";
        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private Doctor mapResultSetToDoctor(ResultSet rs) throws SQLException {
        return new Doctor(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("specialization"),
                rs.getString("qualification"),
                rs.getInt("experience_years"),
                rs.getString("phone"),
                rs.getString("email"),
                rs.getDouble("consultation_fee"),
                rs.getString("available_days"),
                rs.getString("available_time"),
                rs.getString("status")
        );
    }
}
