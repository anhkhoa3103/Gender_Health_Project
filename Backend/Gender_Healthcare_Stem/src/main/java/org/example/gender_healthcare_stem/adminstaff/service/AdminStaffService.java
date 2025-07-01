package org.example.gender_healthcare_stem.adminstaff.service;

import org.example.gender_healthcare_stem.adminstaff.dto.StiAppointmentDto;
import org.example.gender_healthcare_stem.adminstaff.dto.StaffDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Service
public class AdminStaffService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Get all STI appointments with staff and customer details
    public List<StiAppointmentDto> getAllStiAppointments() {
        String sql = """
            SELECT 
                sa.appointment_id,
                sa.customer_id,
                sa.staff_id,
                sa.status,
                sa.amount,
                cu.full_name as customer_name,
                cu.email as customer_email,
                cu.phone as customer_phone,
                st.full_name as staff_name,
                st.email as staff_email,
                st.created_at as created_date,
                COALESCE(pkg.package_name, 'Individual Tests') as test_package_name
            FROM stiappointment sa
            LEFT JOIN customers c ON sa.customer_id = c.customer_id
            LEFT JOIN users cu ON c.customer_id = cu.user_id
            LEFT JOIN users st ON sa.staff_id = st.user_id
            LEFT JOIN invoices i ON sa.appointment_id = i.appointment_id
            LEFT JOIN package pkg ON i.paid_items = pkg.package_id::text
            ORDER BY sa.appointment_id DESC
        """;

        return jdbcTemplate.query(sql, new StiAppointmentRowMapper());
    }

    // Override STI appointment status
    @Transactional
    public void overrideAppointmentStatus(Long appointmentId, String newStatus) {
        String sql = "UPDATE stiappointment SET status = ? WHERE appointment_id = ?";
        jdbcTemplate.update(sql, newStatus, appointmentId);
    }

    // Get all staff members
    public List<StaffDto> getAllStaff() {
        String sql = """
            SELECT 
                u.user_id,
                u.full_name,
                u.email,
                u.phone,
                u.role,
                u.status,
                u.created_at,
                u.avatar,
                COUNT(sa.appointment_id) as total_appointments
            FROM users u
            LEFT JOIN stiappointment sa ON u.user_id = sa.staff_id
            WHERE u.role IN ('STAFF', 'ADMIN', 'MANAGER')
            GROUP BY u.user_id, u.full_name, u.email, u.phone, u.role, u.status, u.created_at, u.avatar
            ORDER BY u.created_at DESC
        """;

        return jdbcTemplate.query(sql, new StaffRowMapper());
    }

    // Toggle staff status
    @Transactional
    public void toggleStaffStatus(Long staffId, String newStatus) {
        String sql = "UPDATE users SET status = ? WHERE user_id = ?";
        jdbcTemplate.update(sql, newStatus, staffId);
    }

    // Get staff performance metrics
    public List<Map<String, Object>> getStaffPerformance() {
        String sql = """
            SELECT 
                u.full_name as staff_name,
                u.user_id as staff_id,
                COUNT(sa.appointment_id) as total_appointments,
                COUNT(CASE WHEN sa.status = 'COMPLETED' THEN 1 END) as completed_appointments,
                COUNT(CASE WHEN sa.status = 'CANCELLED' THEN 1 END) as cancelled_appointments,
                ROUND(
                    (COUNT(CASE WHEN sa.status = 'COMPLETED' THEN 1 END) * 100.0 / 
                     NULLIF(COUNT(sa.appointment_id), 0)), 2
                ) as success_rate,
                COALESCE(SUM(sa.amount), 0) as total_revenue,
                COALESCE(AVG(f.rating), 0) as avg_rating
            FROM users u
            LEFT JOIN stiappointment sa ON u.user_id = sa.staff_id
            LEFT JOIN feedback f ON u.user_id = f.consultant_id
            WHERE u.role IN ('STAFF', 'ADMIN', 'MANAGER')
            GROUP BY u.user_id, u.full_name
            ORDER BY total_appointments DESC, success_rate DESC
        """;

        return jdbcTemplate.queryForList(sql);
    }

    // Get appointment logs for auditing
    public List<StiAppointmentDto> getAppointmentLogs() {
        // Similar to getAllStiAppointments but with additional audit information
        String sql = """
            SELECT 
                sa.appointment_id,
                sa.customer_id,
                sa.staff_id,
                sa.status,
                sa.amount,
                cu.full_name as customer_name,
                cu.email as customer_email,
                cu.phone as customer_phone,
                st.full_name as staff_name,
                st.email as staff_email,
                st.created_at as created_date,
                COALESCE(pkg.package_name, 'Individual Tests') as test_package_name
            FROM stiappointment sa
            LEFT JOIN customers c ON sa.customer_id = c.customer_id
            LEFT JOIN users cu ON c.customer_id = cu.user_id
            LEFT JOIN users st ON sa.staff_id = st.user_id
            LEFT JOIN invoices i ON sa.appointment_id = i.appointment_id
            LEFT JOIN package pkg ON i.paid_items = pkg.package_id::text
            WHERE sa.status IN ('COMPLETED', 'CANCELLED')
            ORDER BY sa.appointment_id DESC
        """;

        return jdbcTemplate.query(sql, new StiAppointmentRowMapper());
    }

    // Get revenue analytics
    public Map<String, Object> getRevenueAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        // Total revenue
        String totalRevenueSql = "SELECT COALESCE(SUM(amount), 0) FROM stiappointment WHERE status = 'COMPLETED'";
        Double totalRevenue = jdbcTemplate.queryForObject(totalRevenueSql, Double.class);

        // Monthly revenue
        String monthlyRevenueSql = """
            SELECT 
                DATE_TRUNC('month', CURRENT_DATE) as month,
                COALESCE(SUM(amount), 0) as revenue
            FROM stiappointment 
            WHERE status = 'COMPLETED' 
            AND DATE_TRUNC('month', CURRENT_DATE) = DATE_TRUNC('month', CURRENT_DATE)
        """;
        Double monthlyRevenue = jdbcTemplate.queryForObject(monthlyRevenueSql, Double.class);

        // Revenue by test type
        String revenueByTestSql = """
            SELECT 
                COALESCE(pkg.package_name, 'Individual Tests') as test_type,
                COALESCE(SUM(sa.amount), 0) as revenue
            FROM stiappointment sa
            LEFT JOIN invoices i ON sa.appointment_id = i.appointment_id
            LEFT JOIN package pkg ON i.paid_items = pkg.package_id::text
            WHERE sa.status = 'COMPLETED'
            GROUP BY pkg.package_name
            ORDER BY revenue DESC
        """;
        List<Map<String, Object>> revenueByTest = jdbcTemplate.queryForList(revenueByTestSql);

        analytics.put("totalRevenue", totalRevenue);
        analytics.put("monthlyRevenue", monthlyRevenue);
        analytics.put("revenueByTest", revenueByTest);

        return analytics;
    }

    // Get appointment statistics
    public Map<String, Object> getAppointmentStatistics() {
        Map<String, Object> statistics = new HashMap<>();

        // Total appointments
        String totalSql = "SELECT COUNT(*) FROM stiappointment";
        Integer totalAppointments = jdbcTemplate.queryForObject(totalSql, Integer.class);

        // Appointments by status
        String statusSql = """
            SELECT status, COUNT(*) as count 
            FROM stiappointment 
            GROUP BY status 
            ORDER BY count DESC
        """;
        List<Map<String, Object>> appointmentsByStatus = jdbcTemplate.queryForList(statusSql);

        // This month's appointments
        String thisMonthSql = """
            SELECT COUNT(*) FROM stiappointment 
            WHERE DATE_TRUNC('month', CURRENT_DATE) = DATE_TRUNC('month', CURRENT_DATE)
        """;
        Integer thisMonthAppointments = jdbcTemplate.queryForObject(thisMonthSql, Integer.class);

        statistics.put("totalAppointments", totalAppointments);
        statistics.put("appointmentsByStatus", appointmentsByStatus);
        statistics.put("thisMonthAppointments", thisMonthAppointments);

        return statistics;
    }

    // Assign staff to appointment
    @Transactional
    public void assignStaffToAppointment(Long appointmentId, Long staffId) {
        String sql = "UPDATE stiappointment SET staff_id = ? WHERE appointment_id = ?";
        jdbcTemplate.update(sql, staffId, appointmentId);
    }

    // Get appointment results
    public Map<String, Object> getAppointmentResults(Long appointmentId) {
        String sql = """
            SELECT 
                tr.result_id,
                tr.collected_at,
                tr.received_at,
                tr.reported_at,
                trd.test_id,
                tt.test_name,
                trd.value,
                trd.result
            FROM test_result tr
            JOIN test_result_detail trd ON tr.result_id = trd.result_id
            JOIN test_type tt ON trd.test_id = tt.test_id
            WHERE tr.appointment_id = ?
            ORDER BY tt.test_name
        """;

        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, appointmentId);

        Map<String, Object> appointmentResults = new HashMap<>();
        appointmentResults.put("appointmentId", appointmentId);
        appointmentResults.put("testResults", results);

        return appointmentResults;
    }

    // Update appointment amount
    @Transactional
    public void updateAppointmentAmount(Long appointmentId, Double newAmount) {
        String sql = "UPDATE stiappointment SET amount = ? WHERE appointment_id = ?";
        jdbcTemplate.update(sql, newAmount, appointmentId);
    }

    // Row mappers
    private static class StiAppointmentRowMapper implements RowMapper<StiAppointmentDto> {
        @Override
        public StiAppointmentDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            StiAppointmentDto dto = new StiAppointmentDto();
            dto.setAppointmentId(rs.getLong("appointment_id"));
            dto.setCustomerId(rs.getLong("customer_id"));
            dto.setStaffId(rs.getLong("staff_id"));
            dto.setStatus(rs.getString("status"));
            dto.setAmount(rs.getDouble("amount"));
            dto.setCustomerName(rs.getString("customer_name"));
            dto.setCustomerEmail(rs.getString("customer_email"));
            dto.setCustomerPhone(rs.getString("customer_phone"));
            dto.setStaffName(rs.getString("staff_name"));
            dto.setStaffEmail(rs.getString("staff_email"));
            dto.setCreatedDate(rs.getTimestamp("created_date"));
            dto.setTestPackageName(rs.getString("test_package_name"));
            return dto;
        }
    }

    private static class StaffRowMapper implements RowMapper<StaffDto> {
        @Override
        public StaffDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            StaffDto dto = new StaffDto();
            dto.setUserId(rs.getLong("user_id"));
            dto.setFullName(rs.getString("full_name"));
            dto.setEmail(rs.getString("email"));
            dto.setPhone(rs.getString("phone"));
            dto.setRole(rs.getString("role"));
            dto.setStatus(rs.getString("status"));
            dto.setCreatedAt(rs.getString("created_at"));
            dto.setAvatar(rs.getString("avatar"));
            dto.setTotalAppointments(rs.getInt("total_appointments"));
            return dto;
        }
    }
    public int getTotalStaffCount() {
        String sql = """
        SELECT COUNT(*) FROM users
        WHERE role IN ('STAFF', 'ADMIN', 'MANAGER')
    """;
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }
    public int getTotalAppointmentCount() {
        String sql = "SELECT COUNT(*) FROM stiappointment";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

}