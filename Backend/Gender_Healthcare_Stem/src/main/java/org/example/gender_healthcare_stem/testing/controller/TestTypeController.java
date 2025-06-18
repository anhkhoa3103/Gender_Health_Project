package org.example.gender_healthcare_stem.testing.controller;

import org.example.gender_healthcare_stem.testing.service.TestTypeService;
import org.example.gender_healthcare_stem.testing.model.TestType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/testtype")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TestTypeController {
    private static final Logger log = LoggerFactory.getLogger(TestTypeController.class);

    @Autowired
    private TestTypeService service;

    @GetMapping("")
    public ResponseEntity<List<TestType>> GetTestType() {
        List<TestType> testTypes = service.getTestTypes();
        return ResponseEntity.ok(testTypes);
    }
}
