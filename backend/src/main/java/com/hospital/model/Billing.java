package com.hospital.model;

public class Billing {
    private int id;
    private int patientId;
    private Integer appointmentId;
    private double consultationFee;
    private double medicineFee;
    private double testFee;
    private double otherCharges;
    private double totalAmount;
    private String paymentStatus; // PAID, PENDING, PARTIAL
    private String paymentMode;   // CASH, CARD, UPI, INSURANCE
    private String billingDate;
    private String notes;

    // Joined display fields
    private String patientName;
    private String patientContact;

    public Billing() {}

    public Billing(int id, int patientId, Integer appointmentId, double consultationFee,
                   double medicineFee, double testFee, double otherCharges, double totalAmount,
                   String paymentStatus, String paymentMode, String billingDate, String notes) {
        this.id = id;
        this.patientId = patientId;
        this.appointmentId = appointmentId;
        this.consultationFee = consultationFee;
        this.medicineFee = medicineFee;
        this.testFee = testFee;
        this.otherCharges = otherCharges;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
        this.paymentMode = paymentMode;
        this.billingDate = billingDate;
        this.notes = notes;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getPatientId() { return patientId; }
    public void setPatientId(int patientId) { this.patientId = patientId; }

    public Integer getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Integer appointmentId) { this.appointmentId = appointmentId; }

    public double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }

    public double getMedicineFee() { return medicineFee; }
    public void setMedicineFee(double medicineFee) { this.medicineFee = medicineFee; }

    public double getTestFee() { return testFee; }
    public void setTestFee(double testFee) { this.testFee = testFee; }

    public double getOtherCharges() { return otherCharges; }
    public void setOtherCharges(double otherCharges) { this.otherCharges = otherCharges; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getBillingDate() { return billingDate; }
    public void setBillingDate(String billingDate) { this.billingDate = billingDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientContact() { return patientContact; }
    public void setPatientContact(String patientContact) { this.patientContact = patientContact; }
}
