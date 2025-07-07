package org.example.gender_healthcare_stem.adminservice.service;


import org.example.gender_healthcare_stem.adminservice.dto.TestType;
import org.example.gender_healthcare_stem.adminservice.dto.TestTypeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class AdminTestTypeService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<TestType> getAllTestTypes() {
        String sql = "SELECT test_id, test_name, price, threshold FROM test_type ORDER BY test_name";
        return jdbcTemplate.query(sql, new TestTypeRowMapper());
    }

    public TestType getTestTypeById(Integer testId) {
        String sql = "SELECT test_id, test_name, price, threshold FROM test_type WHERE test_id = ?";

        try {
            return jdbcTemplate.queryForObject(sql, new TestTypeRowMapper(), testId);
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public TestType createTestType(TestTypeRequest request) {
        validateTestTypeRequest(request);

        // Check if test name already exists
        String checkSql = "SELECT COUNT(*) FROM test_type WHERE LOWER(test_name) = LOWER(?)";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, request.getTestName().trim());

        if (count > 0) {
            throw new IllegalArgumentException("Test name already exists");
        }

        String insertSql = "INSERT INTO test_type (test_name, price, threshold) VALUES (?, ?, ?) RETURNING test_id";
        Integer testId = jdbcTemplate.queryForObject(
                insertSql,
                Integer.class,
                request.getTestName().trim(),
                request.getPrice(),
                request.getThreshold()
        );

        return getTestTypeById(testId);
    }

    @Transactional
    public TestType updateTestType(Integer testId, TestTypeRequest request) {
        validateTestTypeRequest(request);

        TestType existingTestType = getTestTypeById(testId);
        if (existingTestType == null) {
            throw new IllegalArgumentException("Test type not found");
        }

        // Check if test name already exists (excluding current test)
        String checkSql = "SELECT COUNT(*) FROM test_type WHERE LOWER(test_name) = LOWER(?) AND test_id != ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, request.getTestName().trim(), testId);

        if (count > 0) {
            throw new IllegalArgumentException("Test name already exists");
        }

        String updateSql = "UPDATE test_type SET test_name = ?, price = ?, threshold = ? WHERE test_id = ?";
        jdbcTemplate.update(
                updateSql,
                request.getTestName().trim(),
                request.getPrice(),
                request.getThreshold(),
                testId
        );

        return getTestTypeById(testId);
    }

    @Transactional
    public boolean deleteTestType(Integer testId) {
        TestType existingTestType = getTestTypeById(testId);
        if (existingTestType == null) {
            return false;
        }

        try {
            // Check if test type is being used in any packages
            String checkUsageSql = "SELECT COUNT(*) FROM package_test WHERE test_id = ?";
            Integer usageCount = jdbcTemplate.queryForObject(checkUsageSql, Integer.class, testId);

            if (usageCount > 0) {
                throw new IllegalArgumentException("Cannot delete test type because it is being used in " + usageCount + " package(s)");
            }

            String deleteSql = "DELETE FROM test_type WHERE test_id = ?";
            int rowsAffected = jdbcTemplate.update(deleteSql, testId);
            return rowsAffected > 0;
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Cannot delete test type because it is being used in packages");
        }
    }

    private void validateTestTypeRequest(TestTypeRequest request) {
        if (request.getTestName() == null || request.getTestName().trim().isEmpty()) {
            throw new IllegalArgumentException("Test name is required");
        }

        if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }

        if (request.getThreshold() == null || request.getThreshold() < 0) {
            throw new IllegalArgumentException("Threshold must be greater than or equal to 0");
        }
    }

    private static class TestTypeRowMapper implements RowMapper<TestType> {
        @Override
        public TestType mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new TestType(
                    rs.getInt("test_id"),
                    rs.getString("test_name"),
                    rs.getBigDecimal("price"),
                    rs.getDouble("threshold")
            );
        }
    }
}
