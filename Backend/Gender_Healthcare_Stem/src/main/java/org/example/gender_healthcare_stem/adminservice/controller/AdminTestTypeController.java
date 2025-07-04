package org.example.gender_healthcare_stem.adminservice.controller;

import org.example.gender_healthcare_stem.adminservice.dto.TestType;
import org.example.gender_healthcare_stem.adminservice.dto.TestTypeRequest;
import org.example.gender_healthcare_stem.adminservice.service.AdminTestTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/test-types")
@CrossOrigin(origins = "*")
public class AdminTestTypeController { // Renamed here

    @Autowired
    private AdminTestTypeService testTypeService;

    @GetMapping
    public ResponseEntity<List<TestType>> getAllTestTypes() {
        return ResponseEntity.ok(testTypeService.getAllTestTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestType> getTestTypeById(@PathVariable Integer id) {
        TestType testType = testTypeService.getTestTypeById(id);
        return (testType != null) ? ResponseEntity.ok(testType) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTestType(@RequestBody TestTypeRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            TestType created = testTypeService.createTestType(request);
            response.put("success", true);
            response.put("message", "Test type created successfully");
            response.put("data", created);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error occurred while creating test type");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTestType(@PathVariable Integer id, @RequestBody TestTypeRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            TestType updated = testTypeService.updateTestType(id, request);
            response.put("success", true);
            response.put("message", "Test type updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Update failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTestType(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean deleted = testTypeService.deleteTestType(id);
            if (deleted) {
                response.put("success", true);
                response.put("message", "Test type deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Test type not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Delete failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}