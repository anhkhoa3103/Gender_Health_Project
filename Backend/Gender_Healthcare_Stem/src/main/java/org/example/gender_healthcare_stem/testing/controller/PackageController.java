package org.example.gender_healthcare_stem.testing.controller;


import org.example.gender_healthcare_stem.testing.model.TestType;
import org.example.gender_healthcare_stem.testing.service.PackageService;
import org.example.gender_healthcare_stem.testing.model.Package;
import org.example.gender_healthcare_stem.testing.service.PackageTestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/package")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PackageController {
    private static final Logger log = LoggerFactory.getLogger(PackageController.class);

    @Autowired
    private PackageService service;
    @Autowired
    private PackageTestService packageTestService;
    @PostMapping("")
    public ResponseEntity<List<Package>> GetPackagess() {
        List<Package> packages = service.getPackages();
        return ResponseEntity.ok(packages);
    }
    @GetMapping("/{packageId}/test-types")
    public ResponseEntity<List<TestType>> getTestTypesByPackage(@PathVariable Long packageId) {
        List<TestType> testTypes = packageTestService.getTestTypesForPackage(packageId);
        return ResponseEntity.ok(testTypes);
    }
}
