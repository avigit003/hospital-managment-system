package com.hospital.dao;

import com.hospital.config.DatabaseConfig;
import com.hospital.model.Billing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class BillingDAO {

    @Autowired
    private DatabaseConfig dbConfig;

    // CREATE (Generate Bill/Invoice)
    public Billing create(Billing b) throws SQLException {
        double total = b.getConsultationFee() + b.getMedicineFee() + b.getTestFee() + b.getOtherCharges();
        b.setTotalAmount(total);

        String sql = "INSERT INTO billing (patient_id, appointment_id, consultation_fee, medicine_fee, test_fee, other_charges, total_amount, payment_status, payment_mode, billing_date, notes) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String date = b.getBillingDate() != null && !b.getBillingDate().isEmpty() ? b.getBillingDate() : LocalDate.now().toString();

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, b.getPatientId());
            if (b.getAppointmentId() != null) {
                ps.setInt(2, b.getAppointmentId());
            } else {
                ps.setNull(2, Types.INTEGER);
            }
            ps.setDouble(3, b.getConsultationFee());
            ps.setDouble(4, b.getMedicineFee());
            ps.setDouble(5, b.getTestFee());
            ps.setDouble(6, b.getOtherCharges());
            ps.setDouble(7, total);
            ps.setString(8, b.getPaymentStatus() != null ? b.getPaymentStatus() : "PENDING");
            ps.setString(9, b.getPaymentMode() != null ? b.getPaymentMode() : "CASH");
            ps.setString(10, date);
            ps.setString(11, b.getNotes());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        b.setId(rs.getInt(1));
                    }
                }
            }
            return findById(b.getId());
        }
    }

    // READ (Find All Invoices)
    public List<Billing> findAll() throws SQLException {
        List<Billing> list = new ArrayList<>();
        String sql = "SELECT b.*, p.name AS patient_name, p.contact AS patient_contact " +
                     "FROM billing b " +
                     "LEFT JOIN patients p ON b.patient_id = p.id " +
                     "ORDER BY b.billing_date DESC, b.id DESC";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToBilling(rs));
            }
        }
        return list;
    }

    // READ (Find By ID)
    public Billing findById(int id) throws SQLException {
        String sql = "SELECT b.*, p.name AS patient_name, p.contact AS patient_contact " +
                     "FROM billing b " +
                     "LEFT JOIN patients p ON b.patient_id = p.id " +
                     "WHERE b.id = ?";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToBilling(rs);
                }
            }
        }
        return null;
    }

    // UPDATE (Edit Invoice)
    public boolean update(Billing b) throws SQLException {
        double total = b.getConsultationFee() + b.getMedicineFee() + b.getTestFee() + b.getOtherCharges();
        String sql = "UPDATE billing SET patient_id = ?, appointment_id = ?, consultation_fee = ?, " +
                     "medicine_fee = ?, test_fee = ?, other_charges = ?, total_amount = ?, " +
                     "payment_status = ?, payment_mode = ?, billing_date = ?, notes = ? WHERE id = ?";

        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, b.getPatientId());
            if (b.getAppointmentId() != null) {
                ps.setInt(2, b.getAppointmentId());
            } else {
                ps.setNull(2, Types.INTEGER);
            }
            ps.setDouble(3, b.getConsultationFee());
            ps.setDouble(4, b.getMedicineFee());
            ps.setDouble(5, b.getTestFee());
            ps.setDouble(6, b.getOtherCharges());
            ps.setDouble(7, total);
            ps.setString(8, b.getPaymentStatus());
            ps.setString(9, b.getPaymentMode());
            ps.setString(10, b.getBillingDate());
            ps.setString(11, b.getNotes());
            ps.setInt(12, b.getId());

            return ps.executeUpdate() > 0;
        }
    }

    // UPDATE STATUS
    public boolean updateStatus(int id, String status) throws SQLException {
        String sql = "UPDATE billing SET payment_status = ? WHERE id = ?";
        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, status);
            ps.setInt(2, id);

            return ps.executeUpdate() > 0;
        }
    }

    // DELETE
    public boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM billing WHERE id = ?";
        try (Connection conn = dbConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private Billing mapResultSetToBilling(ResultSet rs) throws SQLException {
        Billing b = new Billing(
                rs.getInt("id"),
                rs.getInt("patient_id"),
                (Integer) rs.getObject("appointment_id"),
                rs.getDouble("consultation_fee"),
                rs.getDouble("medicine_fee"),
                rs.getDouble("test_fee"),
                rs.getDouble("other_charges"),
                rs.getDouble("total_amount"),
                rs.getString("payment_status"),
                rs.getString("payment_mode"),
                rs.getString("billing_date"),
                rs.getString("notes")
        );
        b.setPatientName(rs.getString("patient_name"));
        b.setPatientContact(rs.getString("patient_contact"));
        return b;
    }
}
