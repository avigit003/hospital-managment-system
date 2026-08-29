package com.hospital.controller;

import com.hospital.dao.MedicalRecordDAO;
import com.hospital.model.MedicalRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordDAO medicalRecordDAO;

    @GetMapping
    public ResponseEntity<?> getAllRecords() {
        try {
            List<MedicalRecord> list = medicalRecordDAO.findAll();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecordById(@PathVariable int id) {
        try {
            MedicalRecord m = medicalRecordDAO.findById(id);
            if (m == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Medical record not found"));
            }
            return ResponseEntity.ok(m);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getRecordsByPatientId(@PathVariable int patientId) {
        try {
            List<MedicalRecord> list = medicalRecordDAO.findByPatientId(patientId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createRecord(@RequestBody MedicalRecord record) {
        try {
            if (record.getPatientId() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Patient ID is required"));
            }
            if (record.getDiagnosis() == null || record.getDiagnosis().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Diagnosis is required"));
            }
            MedicalRecord created = medicalRecordDAO.create(record);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecord(@PathVariable int id, @RequestBody MedicalRecord record) {
        try {
            record.setId(id);
            boolean updated = medicalRecordDAO.update(record);
            if (!updated) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Medical record not found"));
            }
            MedicalRecord fetched = medicalRecordDAO.findById(id);
            return ResponseEntity.ok(fetched);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecord(@PathVariable int id) {
        try {
            boolean deleted = medicalRecordDAO.delete(id);
            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Medical record not found"));
            }
            return ResponseEntity.ok(Map.of("message", "Medical record deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
