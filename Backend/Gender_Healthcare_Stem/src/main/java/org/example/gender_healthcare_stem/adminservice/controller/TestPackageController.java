package org.example.gender_healthcare_stem.adminservice.controller;

import org.example.gender_healthcare_stem.adminservice.dto.TestPackageDto;
import org.example.gender_healthcare_stem.adminservice.dto.PackageRequest;
import org.example.gender_healthcare_stem.adminservice.dto.TestType;
import org.example.gender_healthcare_stem.adminservice.service.TestPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/packages")
@CrossOrigin(origins = "*")
public class TestPackageController {

    @Autowired
    private TestPackageService testPackageService;

    @GetMapping
    public ResponseEntity<List<TestPackageDto>> getAllPackages() {
        return ResponseEntity.ok(testPackageService.getAllPackages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestPackageDto> getPackageById(@PathVariable Integer id) {
        TestPackageDto pkg = testPackageService.getPackageById(id);
        return (pkg != null) ? ResponseEntity.ok(pkg) : ResponseEntity.notFound().build();
    }

    @GetMapping("/test-types")
    public ResponseEntity<List<TestType>> getAllTestTypes() {
        return ResponseEntity.ok(testPackageService.getAllTestTypes());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPackage(@RequestBody PackageRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            TestPackageDto created = testPackageService.createPackage(request);
            response.put("success", true);
            response.put("message", "Created successfully");
            response.put("data", created);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePackage(@PathVariable Integer id, @RequestBody PackageRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            TestPackageDto updated = testPackageService.updatePackage(id, request);
            response.put("success", true);
            response.put("message", "Updated successfully");
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
    public ResponseEntity<Map<String, Object>> deletePackage(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean deleted = testPackageService.deletePackage(id);
            if (deleted) {
                response.put("success", true);
                response.put("message", "Deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Package not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Delete failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
