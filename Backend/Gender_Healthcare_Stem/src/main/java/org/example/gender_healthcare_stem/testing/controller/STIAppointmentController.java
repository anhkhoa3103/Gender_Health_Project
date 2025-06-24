package org.example.gender_healthcare_stem.testing.controller;

import org.example.gender_healthcare_stem.testing.dto.STIAppointmentDTO;
import org.example.gender_healthcare_stem.testing.dto.STIAppointmentRequest;
import org.example.gender_healthcare_stem.testing.model.STIAppointment;
import org.example.gender_healthcare_stem.testing.service.STIAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.gender_healthcare_stem.testing.dto.StatusUpdateRequestDTO;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sti-appointment")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class STIAppointmentController {
    @Autowired
    private STIAppointmentService appointmentService;

    @PostMapping("/create")
    public ResponseEntity<?> createAppointment(@RequestBody STIAppointmentRequest req) {
        STIAppointment appointment = appointmentService.createAppointment(req);
        return ResponseEntity.ok().body(
                java.util.Map.of(
                        "appointmentId", appointment.getAppointmentId(),
                        "status", appointment.getStatus()
                )
        );
    }
    @GetMapping("/staff/all")
    public ResponseEntity<List<STIAppointmentDTO>> getAllAppointmentsWithNames() {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsWithNames());
    }
    @PutMapping("/staff/update-status/{appointmentId}")
    public ResponseEntity<?> updateStatus(
            @PathVariable int appointmentId,
            @RequestBody StatusUpdateRequestDTO req
    ) {
        appointmentService.updateStatusAndTimestamps(appointmentId, req.getStatus(), req.getStaffId());
        return ResponseEntity.ok().body("Status updated successfully");
    }


}
