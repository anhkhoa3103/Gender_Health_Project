package org.example.gender_healthcare_stem.testing.controller;

import org.example.gender_healthcare_stem.testing.dto.PackageResponse;
import org.example.gender_healthcare_stem.testing.dto.SubmitResultRequest;
import org.example.gender_healthcare_stem.testing.dto.TestTypeResponse;
import org.example.gender_healthcare_stem.testing.model.STIAppointment;
import org.example.gender_healthcare_stem.testing.model.Package;
import org.example.gender_healthcare_stem.testing.model.TestType;
import org.example.gender_healthcare_stem.testing.service.STIAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import org.example.gender_healthcare_stem.testing.dto.CreateOrderRequest;
@RestController
@RequestMapping("/api/customer/sti")
public class STIAppointmentController {

    @Autowired
    private STIAppointmentService appointmentService;

    @PostMapping("/create-order")
    public ResponseEntity<STIAppointment> createAppointment(@RequestBody CreateOrderRequest request) {
        try {
            STIAppointment created = appointmentService.createAppointment(request);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/packages")
    public ResponseEntity<List<PackageResponse>> getAllPackages() {
        List<PackageResponse> packages = appointmentService.getAllPackages();
        return ResponseEntity.ok(packages);
    }
    @GetMapping("/test-types")
    public ResponseEntity<List<TestTypeResponse>> getAllIndividualTests() {
        List<TestTypeResponse> testTypes = appointmentService.getAllIndividualTests();
        return  ResponseEntity.ok(testTypes);
    }
    @GetMapping("/my-orders")
    public ResponseEntity<List<STIAppointment>> getAppointmentsByCustomerId(@RequestParam Long customerId) {
        try {
            List<STIAppointment> appointments = appointmentService.getAppointmentsByCustomerId(customerId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/result/{id}")
    public ResponseEntity<SubmitResultRequest> getAppointmentResult(@PathVariable Long id) {
        try {
            SubmitResultRequest response = appointmentService.getAppointmentById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
