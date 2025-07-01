package org.example.gender_healthcare_stem.adminstaff.controller;

import org.example.gender_healthcare_stem.adminstaff.dto.StiAppointmentDto;
import org.example.gender_healthcare_stem.adminstaff.dto.StaffDto;
import org.example.gender_healthcare_stem.adminstaff.service.AdminStaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/staff")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminStaffController {

    @Autowired
    private AdminStaffService adminStaffService;

    // Get all STI appointments
    @GetMapping("/appointments/all")
    public ResponseEntity<List<StiAppointmentDto>> getAllStiAppointments() {
        List<StiAppointmentDto> appointments = adminStaffService.getAllStiAppointments();
        return ResponseEntity.ok(appointments);
    }

    // Override STI appointment status
    @PostMapping("/appointments/override-status/{id}")
    public ResponseEntity<String> overrideAppointmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String newStatus = request.get("status");
        adminStaffService.overrideAppointmentStatus(id, newStatus);
        return ResponseEntity.ok("STI appointment status updated successfully");
    }

    // Get all staff members
    @GetMapping("/all")
    public ResponseEntity<List<StaffDto>> getAllStaff() {
        List<StaffDto> staff = adminStaffService.getAllStaff();
        return ResponseEntity.ok(staff);
    }

    // Toggle staff status (active/inactive)
    @PostMapping("/toggle-status/{id}")
    public ResponseEntity<String> toggleStaffStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String newStatus = request.get("status");
        adminStaffService.toggleStaffStatus(id, newStatus);
        return ResponseEntity.ok("Staff status updated successfully");
    }

    // Get staff performance metrics
    @GetMapping("/performance")
    public ResponseEntity<List<Map<String, Object>>> getStaffPerformance() {
        List<Map<String, Object>> performance = adminStaffService.getStaffPerformance();
        return ResponseEntity.ok(performance);
    }

    // Get appointment logs for auditing
    @GetMapping("/appointments/logs")
    public ResponseEntity<List<StiAppointmentDto>> getAppointmentLogs() {
        List<StiAppointmentDto> logs = adminStaffService.getAppointmentLogs();
        return ResponseEntity.ok(logs);
    }

    // Get revenue analytics
    @GetMapping("/revenue/analytics")
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics() {
        Map<String, Object> analytics = adminStaffService.getRevenueAnalytics();
        return ResponseEntity.ok(analytics);
    }

    // Get appointment statistics
    @GetMapping("/appointments/statistics")
    public ResponseEntity<Map<String, Object>> getAppointmentStatistics() {
        Map<String, Object> statistics = adminStaffService.getAppointmentStatistics();
        return ResponseEntity.ok(statistics);
    }

    // Assign staff to appointment (if needed)
    @PostMapping("/appointments/assign/{appointmentId}")
    public ResponseEntity<String> assignStaffToAppointment(
            @PathVariable Long appointmentId,
            @RequestBody Map<String, Long> request) {

        Long staffId = request.get("staffId");
        adminStaffService.assignStaffToAppointment(appointmentId, staffId);
        return ResponseEntity.ok("Staff assigned to appointment successfully");
    }

    // Get test results for appointment
    @GetMapping("/appointments/{appointmentId}/results")
    public ResponseEntity<Map<String, Object>> getAppointmentResults(
            @PathVariable Long appointmentId) {
        Map<String, Object> results = adminStaffService.getAppointmentResults(appointmentId);
        return ResponseEntity.ok(results);
    }

    // Update appointment amount
    @PostMapping("/appointments/update-amount/{appointmentId}")
    public ResponseEntity<String> updateAppointmentAmount(
            @PathVariable Long appointmentId,
            @RequestBody Map<String, Double> request) {

        Double newAmount = request.get("amount");
        adminStaffService.updateAppointmentAmount(appointmentId, newAmount);
        return ResponseEntity.ok("Appointment amount updated successfully");
    }

    @GetMapping("/appointments/total")
    public ResponseEntity<Integer> getTotalAppointments() {
        int total = adminStaffService.getTotalAppointmentCount();
        return ResponseEntity.ok(total);
    }
}