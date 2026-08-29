package com.hospital.model;

import java.util.List;

public class DashboardStats {
    private int totalPatients;
    private int totalDoctors;
    private int totalAppointments;
    private int todayAppointments;
    private int pendingAppointments;
    private int completedAppointments;
    private double totalRevenue;
    private double pendingRevenue;
    private List<Appointment> recentAppointments;
    private List<Patient> recentPatients;

    public DashboardStats() {}

    public int getTotalPatients() { return totalPatients; }
    public void setTotalPatients(int totalPatients) { this.totalPatients = totalPatients; }

    public int getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(int totalDoctors) { this.totalDoctors = totalDoctors; }

    public int getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(int totalAppointments) { this.totalAppointments = totalAppointments; }

    public int getTodayAppointments() { return todayAppointments; }
    public void setTodayAppointments(int todayAppointments) { this.todayAppointments = todayAppointments; }

    public int getPendingAppointments() { return pendingAppointments; }
    public void setPendingAppointments(int pendingAppointments) { this.pendingAppointments = pendingAppointments; }

    public int getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(int completedAppointments) { this.completedAppointments = completedAppointments; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public double getPendingRevenue() { return pendingRevenue; }
    public void setPendingRevenue(double pendingRevenue) { this.pendingRevenue = pendingRevenue; }

    public List<Appointment> getRecentAppointments() { return recentAppointments; }
    public void setRecentAppointments(List<Appointment> recentAppointments) { this.recentAppointments = recentAppointments; }

    public List<Patient> getRecentPatients() { return recentPatients; }
    public void setRecentPatients(List<Patient> recentPatients) { this.recentPatients = recentPatients; }
}
