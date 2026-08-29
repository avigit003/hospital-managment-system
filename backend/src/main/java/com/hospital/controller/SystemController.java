package com.hospital.controller;

import com.hospital.config.DatabaseConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    @Autowired
    private DatabaseConfig databaseConfig;

    @GetMapping("/status")
    public ResponseEntity<?> getStatus() {
        return ResponseEntity.ok(databaseConfig.getStatus());
    }

    @PostMapping("/reconnect")
    public ResponseEntity<?> reconnect(@RequestBody Map<String, Object> config) {
        String type = (String) config.getOrDefault("type", "mysql");
        String host = (String) config.getOrDefault("host", "localhost");
        int port = config.get("port") instanceof Number ? ((Number) config.get("port")).intValue() : 3306;
        String dbName = (String) config.getOrDefault("dbName", "hospital_db");
        String user = (String) config.getOrDefault("user", "root");
        String password = (String) config.getOrDefault("password", "");

        boolean success = databaseConfig.reconfigure(type, host, port, dbName, user, password);
        Map<String, Object> status = databaseConfig.getStatus();
        status.put("success", success);
        return ResponseEntity.ok(status);
    }
}
