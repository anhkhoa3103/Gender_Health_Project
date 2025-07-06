package org.example.gender_healthcare_stem.adminservice.service;

import org.example.gender_healthcare_stem.adminservice.dto.TestPackageDto;
import org.example.gender_healthcare_stem.adminservice.dto.PackageRequest;
import org.example.gender_healthcare_stem.adminservice.dto.TestType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Service
public class    TestPackageService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private NamedParameterJdbcTemplate namedJdbcTemplate;

    public List<TestPackageDto> getAllPackages() {
        String sql = "SELECT p.package_id, p.package_name, p.total_price FROM package p ORDER BY p.package_id";
        List<TestPackageDto> packages = jdbcTemplate.query(sql, new PackageRowMapper());

        for (TestPackageDto pkg : packages) {
            pkg.setTestTypes(getTestTypesByPackageId(pkg.getPackageId()));
        }

        return packages;
    }

    public TestPackageDto getPackageById(Integer packageId) {
        String sql = "SELECT package_id, package_name, total_price FROM package WHERE package_id = ?";

        try {
            TestPackageDto pkg = jdbcTemplate.queryForObject(sql, new PackageRowMapper(), packageId);
            if (pkg != null) {
                pkg.setTestTypes(getTestTypesByPackageId(packageId));
            }
            return pkg;
        } catch (Exception e) {
            return null;
        }
    }

    public List<TestType> getAllTestTypes() {
        String sql = "SELECT test_id, test_name, price, threshold FROM test_type ORDER BY test_name";
        return jdbcTemplate.query(sql, new TestTypeRowMapper());
    }

    private List<TestType> getTestTypesByPackageId(Integer packageId) {
        String sql = """
            SELECT tt.test_id, tt.test_name, tt.price, tt.threshold
            FROM test_type tt
            INNER JOIN package_test pt ON tt.test_id = pt.test_id
            WHERE pt.package_id = ?
            ORDER BY tt.test_name
            """;
        return jdbcTemplate.query(sql, new TestTypeRowMapper(), packageId);
    }

    @Transactional
    public TestPackageDto createPackage(PackageRequest request) {
        if (request.getPackageName() == null || request.getPackageName().trim().isEmpty()) {
            throw new IllegalArgumentException("Package name is required");
        }
        if (request.getTestIds() == null || request.getTestIds().isEmpty()) {
            throw new IllegalArgumentException("At least one test must be selected");
        }

        // Cho phép nhập totalPrice thủ công nếu có, nếu không thì tính tự động
        BigDecimal totalPrice = (request.getTotalPrice() != null)
                ? request.getTotalPrice()
                : calculateTotalPrice(request.getTestIds());

        String insertPackageSql = "INSERT INTO package (package_name, total_price) VALUES (?, ?) RETURNING package_id";
        Integer packageId = jdbcTemplate.queryForObject(
                insertPackageSql,
                Integer.class,
                request.getPackageName().trim(),
                totalPrice
        );

        String insertPackageTestSql = "INSERT INTO package_test (package_id, test_id) VALUES (?, ?)";
        for (Integer testId : request.getTestIds()) {
            jdbcTemplate.update(insertPackageTestSql, packageId, testId);
        }

        return getPackageById(packageId);
    }

    @Transactional
    public TestPackageDto updatePackage(Integer packageId, PackageRequest request) {
        if (request.getPackageName() == null || request.getPackageName().trim().isEmpty()) {
            throw new IllegalArgumentException("Package name is required");
        }
        if (request.getTestIds() == null || request.getTestIds().isEmpty()) {
            throw new IllegalArgumentException("At least one test must be selected");
        }

        TestPackageDto existingPackage = getPackageById(packageId);
        if (existingPackage == null) {
            throw new IllegalArgumentException("Package not found");
        }

        // Cho phép nhập totalPrice thủ công nếu có, nếu không thì tính tự động
        BigDecimal totalPrice = (request.getTotalPrice() != null)
                ? request.getTotalPrice()
                : calculateTotalPrice(request.getTestIds());

        jdbcTemplate.update("UPDATE package SET package_name = ?, total_price = ? WHERE package_id = ?",
                request.getPackageName().trim(), totalPrice, packageId);

        jdbcTemplate.update("DELETE FROM package_test WHERE package_id = ?", packageId);

        String insertPackageTestSql = "INSERT INTO package_test (package_id, test_id) VALUES (?, ?)";
        for (Integer testId : request.getTestIds()) {
            jdbcTemplate.update(insertPackageTestSql, packageId, testId);
        }

        return getPackageById(packageId);
    }

    @Transactional
    public boolean deletePackage(Integer packageId) {
        TestPackageDto existingPackage = getPackageById(packageId);
        if (existingPackage == null) return false;

        jdbcTemplate.update("DELETE FROM package_test WHERE package_id = ?", packageId);
        int rows = jdbcTemplate.update("DELETE FROM package WHERE package_id = ?", packageId);
        return rows > 0;
    }

    private BigDecimal calculateTotalPrice(List<Integer> testIds) {
        if (testIds == null || testIds.isEmpty()) return BigDecimal.ZERO;

        String sql = "SELECT COALESCE(SUM(price), 0) FROM test_type WHERE test_id IN (:ids)";
        Map<String, Object> params = Map.of("ids", testIds);
        BigDecimal total = namedJdbcTemplate.queryForObject(sql, params, BigDecimal.class);
        return total != null ? total : BigDecimal.ZERO;
    }

    private static class PackageRowMapper implements RowMapper<TestPackageDto> {
        @Override
        public TestPackageDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new TestPackageDto(
                    rs.getInt("package_id"),
                    rs.getString("package_name"),
                    rs.getBigDecimal("total_price")
            );
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
