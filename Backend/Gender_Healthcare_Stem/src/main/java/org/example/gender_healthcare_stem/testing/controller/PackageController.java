package org.example.gender_healthcare_stem.testing.controller;


import org.example.gender_healthcare_stem.testing.service.PackageService;
import org.example.gender_healthcare_stem.testing.model.Package;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/package")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PackageController {
    private static final Logger log = LoggerFactory.getLogger(PackageController.class);

    @Autowired
    private PackageService service;

    @PostMapping("")
    public ResponseEntity<List<Package>> GetPackagess() {
        List<Package> packages = service.getPackages();
        return ResponseEntity.ok(packages);
    }
}
