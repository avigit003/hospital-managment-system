package com.hospital.model;

public class Doctor {
    private int id;
    private String name;
    private String specialization;
    private String qualification;
    private int experienceYears;
    private String phone;
    private String email;
    private double consultationFee;
    private String availableDays;
    private String availableTime;
    private String status; // ACTIVE, ON_LEAVE, INACTIVE

    public Doctor() {}

    public Doctor(int id, String name, String specialization, String qualification, int experienceYears,
                  String phone, String email, double consultationFee, String availableDays,
                  String availableTime, String status) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experienceYears = experienceYears;
        this.phone = phone;
        this.email = email;
        this.consultationFee = consultationFee;
        this.availableDays = availableDays;
        this.availableTime = availableTime;
        this.status = status;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }

    public String getAvailableDays() { return availableDays; }
    public void setAvailableDays(String availableDays) { this.availableDays = availableDays; }

    public String getAvailableTime() { return availableTime; }
    public void setAvailableTime(String availableTime) { this.availableTime = availableTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
