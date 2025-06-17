package org.example.gender_healthcare_stem.testing.controller;

import org.example.gender_healthcare_stem.testing.dto.CollectSampleRequest;
import org.example.gender_healthcare_stem.testing.service.STIAppointmentService;
import org.example.gender_healthcare_stem.testing.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @PostMapping("/collect-sample/{orderId}")
    public ResponseEntity<Void> collectSample(@PathVariable Long orderId, @RequestBody CollectSampleRequest request) {
        boolean exists = staffService.collectSample(orderId);
        if (exists) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/update-status/{orderId}")
    public ResponseEntity<Void> updateStatus(@PathVariable Long orderId, @RequestBody CollectSampleRequest request) {
        boolean updated = staffService.updateStatus(orderId, request);
        if (updated) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
