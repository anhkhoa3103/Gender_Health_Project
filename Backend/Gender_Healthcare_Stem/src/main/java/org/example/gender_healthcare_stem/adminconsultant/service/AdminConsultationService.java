package org.example.gender_healthcare_stem.adminconsultant.service;

import org.example.gender_healthcare_stem.adminconsultant.dto.ConsultationAppointmentDto;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationAppointmentRepository;
import org.example.gender_healthcare_stem.consultation.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class AdminConsultationService {

    @Autowired
    private ConsultationAppointmentRepository appointmentRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ConsultationAppointmentDto> getAllConsultations() {
        String sql = """
            SELECT ca.consultation_id, ca.consultant_id, ca.customer_id, ca.appointment_date, 
                   ca.status, ca.workslot_id,
                   consultant_user.full_name as consultant_name,
                   customer_user.full_name as customer_name,
                   consultant.google_meet_links as google_meet_link,
                   slot.description as slot_description
            FROM consultationappointment ca
            LEFT JOIN consultant ON ca.consultant_id = consultant.user_id
            LEFT JOIN users consultant_user ON consultant.user_id = consultant_user.user_id
            LEFT JOIN customers ON ca.customer_id = customers.customer_id
            LEFT JOIN users customer_user ON customers.customer_id = customer_user.user_id
            LEFT JOIN work_slot ws ON ca.workslot_id = ws.workslot_id
            LEFT JOIN slot ON ws.slot_id = slot.slot_id
            ORDER BY ca.appointment_date DESC
        """;

        return jdbcTemplate.query(sql, this::mapRowToDto);
    }

    public List<ConsultationAppointmentDto> getConsultationLogs() {
        return getAllConsultations(); // Same as getAllConsultations for now
    }

    @Transactional
    public void overrideAppointmentStatus(Long appointmentId, String newStatus) {
        org.example.gender_healthcare_stem.consultation.model.ConsultationAppointment appointment =
                appointmentRepository.findById(appointmentId)
                        .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(newStatus);
        appointmentRepository.save(appointment);
    }

    public List<Map<String, Object>> getConsultantPerformance() {
        String sql = """
            SELECT 
                c.user_id as consultant_id,
                u.full_name as consultant_name,
                COUNT(ca.consultation_id) as total_appointments,
                COUNT(CASE WHEN ca.status = 'COMPLETED' THEN 1 END) as completed_appointments,
                COUNT(CASE WHEN ca.status = 'CANCELLED' THEN 1 END) as cancelled_appointments,
                COALESCE(AVG(f.rating), 0) as average_rating,
                COUNT(f.feedback_id) as total_feedback
            FROM consultant c
            LEFT JOIN users u ON c.user_id = u.user_id
            LEFT JOIN consultationappointment ca ON c.user_id = ca.consultant_id
            LEFT JOIN feedback f ON c.user_id = f.consultant_id
            GROUP BY c.user_id, u.full_name
            ORDER BY total_appointments DESC
        """;

        return jdbcTemplate.queryForList(sql);
    }

    private ConsultationAppointmentDto mapRowToDto(java.sql.ResultSet rs, int rowNum) throws java.sql.SQLException {
        ConsultationAppointmentDto dto = new ConsultationAppointmentDto();
        dto.setConsultationId(rs.getInt("consultation_id"));
        dto.setConsultantId(rs.getInt("consultant_id"));
        dto.setCustomerId(rs.getInt("customer_id"));
        dto.setAppointmentDate(rs.getTimestamp("appointment_date").toLocalDateTime());
        dto.setStatus(rs.getString("status"));
        dto.setWorkslotId(rs.getInt("workslot_id"));
        dto.setConsultantName(rs.getString("consultant_name"));
        dto.setCustomerName(rs.getString("customer_name"));
        dto.setGoogleMeetLink(rs.getString("google_meet_link"));
        dto.setSlotDescription(rs.getString("slot_description"));
        return dto;
    }
}