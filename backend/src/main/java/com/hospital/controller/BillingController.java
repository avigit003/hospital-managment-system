package com.hospital.controller;

import com.hospital.dao.BillingDAO;
import com.hospital.model.Billing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    @Autowired
    private BillingDAO billingDAO;

    @GetMapping
    public ResponseEntity<?> getAllInvoices() {
        try {
            List<Billing> list = billingDAO.findAll();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInvoiceById(@PathVariable int id) {
        try {
            Billing b = billingDAO.findById(id);
            if (b == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Invoice not found"));
            }
            return ResponseEntity.ok(b);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createInvoice(@RequestBody Billing billing) {
        try {
            if (billing.getPatientId() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Valid Patient is required"));
            }
            Billing created = billingDAO.create(billing);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvoice(@PathVariable int id, @RequestBody Billing billing) {
        try {
            billing.setId(id);
            boolean updated = billingDAO.update(billing);
            if (!updated) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Invoice not found"));
            }
            Billing fetched = billingDAO.findById(id);
            return ResponseEntity.ok(fetched);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable int id, @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status field is required"));
            }
            boolean updated = billingDAO.updateStatus(id, status.trim().toUpperCase());
            if (!updated) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Invoice not found"));
            }
            return ResponseEntity.ok(Map.of("message", "Payment status updated to " + status));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable int id) {
        try {
            boolean deleted = billingDAO.delete(id);
            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Invoice not found"));
            }
            return ResponseEntity.ok(Map.of("message", "Invoice deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
