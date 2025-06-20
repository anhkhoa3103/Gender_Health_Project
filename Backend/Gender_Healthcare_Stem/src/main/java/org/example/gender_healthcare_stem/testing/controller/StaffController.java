package org.example.gender_healthcare_stem.testing.controller;

import org.example.gender_healthcare_stem.testing.dto.AssignedOrderDTO;
import org.example.gender_healthcare_stem.testing.dto.CollectSampleRequest;
import org.example.gender_healthcare_stem.testing.service.STIAppointmentService;
import org.example.gender_healthcare_stem.testing.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @PostMapping("/collect-sample/{orderId}")
    public ResponseEntity<?> collectSample(@PathVariable Long orderId) {
        boolean exists = staffService.collectSample(orderId);
        if (exists) {
            return ResponseEntity.ok("Sample collected successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to collect sample.");
        }
    }

    @PostMapping("/update-status/{orderId}")
    public ResponseEntity<Void> updateStatus(@PathVariable Long orderId) {
        boolean updated = staffService.updateToInProgress(orderId);
        if (updated) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/assigned-orders")
    public ResponseEntity<List<AssignedOrderDTO>> getAssignedOrders() {
        List<AssignedOrderDTO> orders = staffService.getAssignedOrders();
        return ResponseEntity.ok(orders);
    }

}
