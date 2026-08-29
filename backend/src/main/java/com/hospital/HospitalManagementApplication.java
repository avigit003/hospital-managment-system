package com.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HospitalManagementApplication {

    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println(" Starting Hospital Management System Backend... ");
        System.out.println(" Powered by Spring Boot + Pure JDBC & REST API   ");
        System.out.println("=================================================");
        SpringApplication.run(HospitalManagementApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Backend is RUNNING on http://localhost:8080    ");
        System.out.println("=================================================");
    }
}
