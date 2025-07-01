package org.example.gender_healthcare_stem.adminservice.service;

import org.example.gender_healthcare_stem.adminservice.dto.StatisticsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class StatisticsService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public StatisticsDto.OverviewStats getOverviewStats() {
        // Total packages
        String totalPackagesSql = "SELECT COUNT(*) FROM package";
        Integer totalPackages = jdbcTemplate.queryForObject(totalPackagesSql, Integer.class);

        // Total tests
        String totalTestsSql = "SELECT COUNT(*) FROM test_type";
        Integer totalTests = jdbcTemplate.queryForObject(totalTestsSql, Integer.class);

        // Average package price
        String avgPriceSql = "SELECT COALESCE(AVG(total_price), 0) FROM package";
        BigDecimal averagePrice = jdbcTemplate.queryForObject(avgPriceSql, BigDecimal.class);
        if (averagePrice != null) {
            averagePrice = averagePrice.setScale(2, RoundingMode.HALF_UP);
        }

        // Total value of all packages
        String totalValueSql = "SELECT COALESCE(SUM(total_price), 0) FROM package";
        BigDecimal totalValue = jdbcTemplate.queryForObject(totalValueSql, BigDecimal.class);

        // Most used test
        String mostUsedTestSql = """
            SELECT tt.test_id, tt.test_name
            FROM test_type tt
            INNER JOIN package_test pt ON tt.test_id = pt.test_id
            GROUP BY tt.test_id, tt.test_name
            ORDER BY COUNT(*) DESC
            LIMIT 1
            """;

        Integer mostUsedTestId = null;
        String mostUsedTestName = null;

        try {
            jdbcTemplate.queryForObject(mostUsedTestSql, (rs, rowNum) -> {
                return new Object[]{rs.getInt("test_id"), rs.getString("test_name")};
            });
            Object[] result = jdbcTemplate.queryForObject(mostUsedTestSql, (rs, rowNum) -> {
                return new Object[]{rs.getInt("test_id"), rs.getString("test_name")};
            });
            mostUsedTestId = (Integer) result[0];
            mostUsedTestName = (String) result[1];
        } catch (Exception e) {
            // No data found
        }

        return new StatisticsDto.OverviewStats(
                totalPackages, totalTests, averagePrice, totalValue, mostUsedTestId, mostUsedTestName
        );
    }

    public List<StatisticsDto.PriceDistribution> getPackagePriceDistribution() {
        String sql = """
            SELECT 
                CASE 
                    WHEN total_price < 500000 THEN 'Under 500K'
                                                 WHEN total_price < 700000 THEN '500K - 699K'
                                                 WHEN total_price < 900000 THEN '700K - 899K'
                                                 ELSE '900K+'
                END as price_range,
                COUNT(*) as count,
                MIN(total_price) as min_price,
                MAX(total_price) as max_price
            FROM package
            GROUP BY 
                CASE 
                   WHEN total_price < 500000 THEN 'Under 500K'
                                                 WHEN total_price < 700000 THEN '500K - 699K'
                                                 WHEN total_price < 900000 THEN '700K - 899K'
                                                 ELSE '900K+'
                END
            ORDER BY min_price
            """;

        return jdbcTemplate.query(sql, new PriceDistributionRowMapper());
    }

    public List<StatisticsDto.PackageTestCount> getPackageTestCount() {
        String sql = """
            SELECT 
                p.package_name,
                COUNT(pt.test_id) as test_count,
                p.total_price
            FROM package p
            LEFT JOIN package_test pt ON p.package_id = pt.package_id
            GROUP BY p.package_id, p.package_name, p.total_price
            ORDER BY test_count DESC, p.package_name
            """;

        return jdbcTemplate.query(sql, new PackageTestCountRowMapper());
    }

    public List<StatisticsDto.TestUsage> getTestUsageStats() {
        String sql = """
            WITH test_usage AS (
                SELECT 
                    tt.test_id,
                    tt.test_name,
                    tt.price,
                    COUNT(pt.package_id) as usage_count
                FROM test_type tt
                LEFT JOIN package_test pt ON tt.test_id = pt.test_id
                GROUP BY tt.test_id, tt.test_name, tt.price
            ),
            total_usage AS (
                SELECT SUM(usage_count) as total FROM test_usage
            )
            SELECT 
                tu.test_id,
                tu.test_name,
                tu.usage_count,
                tu.price,
                CASE 
                    WHEN t.total = 0 THEN 0
                    ELSE ROUND((tu.usage_count * 100.0 / t.total), 2)
                END as usage_percentage
            FROM test_usage tu
            CROSS JOIN total_usage t
            ORDER BY tu.usage_count DESC, tu.test_name
            """;

        return jdbcTemplate.query(sql, new TestUsageRowMapper());
    }

    public List<StatisticsDto.TestPriceRange> getTestPriceRangeStats() {
        String sql = """
            WITH price_ranges AS (
                SELECT 
                    CASE 
                        WHEN price < 50 THEN 'Under $50'
                        WHEN price < 100 THEN '$50 - $99'
                        WHEN price < 200 THEN '$100 - $199'
                        WHEN price < 500 THEN '$200 - $499'
                        ELSE '$500+'
                    END as price_range,
                    COUNT(*) as count
                FROM test_type
                GROUP BY 
                    CASE 
                        WHEN price < 50 THEN 'Under $50'
                        WHEN price < 100 THEN '$50 - $99'
                        WHEN price < 200 THEN '$100 - $199'
                        WHEN price < 500 THEN '$200 - $499'
                        ELSE '$500+'
                    END
            ),
            total_count AS (
                SELECT SUM(count) as total FROM price_ranges
            )
            SELECT 
                pr.price_range,
                pr.count,
                ROUND((pr.count * 100.0 / tc.total), 2) as percentage
            FROM price_ranges pr
            CROSS JOIN total_count tc
            ORDER BY 
                CASE pr.price_range
                    WHEN 'Under $50' THEN 1
                    WHEN '$50 - $99' THEN 2
                    WHEN '$100 - $199' THEN 3
                    WHEN '$200 - $499' THEN 4
                    WHEN '$500+' THEN 5
                END
            """;

        return jdbcTemplate.query(sql, new TestPriceRangeRowMapper());
    }

    public List<StatisticsDto.TopPackage> getTopExpensivePackages(int limit) {
        String sql = """
            SELECT 
                p.package_id,
                p.package_name,
                p.total_price,
                COUNT(pt.test_id) as test_count,
                0 as usage_count
            FROM package p
            LEFT JOIN package_test pt ON p.package_id = pt.package_id
            GROUP BY p.package_id, p.package_name, p.total_price
            ORDER BY p.total_price DESC
            LIMIT ?
            """;

        return jdbcTemplate.query(sql, new TopPackageRowMapper(), limit);
    }

    public List<StatisticsDto.TopPackage> getTopPopularPackages(int limit) {
        String sql = """
            SELECT 
                p.package_id,
                p.package_name,
                p.total_price,
                COUNT(pt.test_id) as test_count,
                COUNT(pt.test_id) as usage_count
            FROM package p
            LEFT JOIN package_test pt ON p.package_id = pt.package_id
            GROUP BY p.package_id, p.package_name, p.total_price
            ORDER BY COUNT(pt.test_id) DESC, p.package_name
            LIMIT ?
            """;

        return jdbcTemplate.query(sql, new TopPackageRowMapper(), limit);
    }

    public List<StatisticsDto.MonthlyTrend> getMonthlyTrends() {
        // Since we don't have created_date columns, we'll create mock monthly data
        // In a real scenario, you would have created_date/created_at columns
        String sql = """
            SELECT 
                'Current Month' as month,
                COUNT(*) as packages_created,
                COALESCE(SUM(total_price), 0) as total_value,
                0 as tests_added
            FROM package
            UNION ALL
            SELECT 
                'All Time Tests' as month,
                0 as packages_created,
                0 as total_value,
                COUNT(*) as tests_added
            FROM test_type
            """;

        return jdbcTemplate.query(sql, new MonthlyTrendRowMapper());
    }

    // Row Mappers
    private static class PriceDistributionRowMapper implements RowMapper<StatisticsDto.PriceDistribution> {
        @Override
        public StatisticsDto.PriceDistribution mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new StatisticsDto.PriceDistribution(
                    rs.getString("price_range"),
                    rs.getInt("count"),
                    rs.getBigDecimal("min_price"),
                    rs.getBigDecimal("max_price")
            );
        }
    }

    private static class PackageTestCountRowMapper implements RowMapper<StatisticsDto.PackageTestCount> {
        @Override
        public StatisticsDto.PackageTestCount mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new StatisticsDto.PackageTestCount(
                    rs.getString("package_name"),
                    rs.getInt("test_count"),
                    rs.getBigDecimal("total_price")
            );
        }
    }

    private static class TestUsageRowMapper implements RowMapper<StatisticsDto.TestUsage> {
        @Override
        public StatisticsDto.TestUsage mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new StatisticsDto.TestUsage(
                    rs.getInt("test_id"),
                    rs.getString("test_name"),
                    rs.getInt("usage_count"),
                    rs.getBigDecimal("price"),
                    rs.getDouble("usage_percentage")
            );
        }
    }

    private static class TestPriceRangeRowMapper implements RowMapper<StatisticsDto.TestPriceRange> {
        @Override
        public StatisticsDto.TestPriceRange mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new StatisticsDto.TestPriceRange(
                    rs.getString("price_range"),
                    rs.getInt("count"),
                    rs.getDouble("percentage")
            );
        }
    }

    private static class TopPackageRowMapper implements RowMapper<StatisticsDto.TopPackage> {
        @Override
        public StatisticsDto.TopPackage mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new StatisticsDto.TopPackage(
                    rs.getInt("package_id"),
                    rs.getString("package_name"),
                    rs.getBigDecimal("total_price"),
                    rs.getInt("test_count"),
                    rs.getInt("usage_count")
            );
        }
    }

    private static class MonthlyTrendRowMapper implements RowMapper<StatisticsDto.MonthlyTrend> {
        @Override
        public StatisticsDto.MonthlyTrend mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new StatisticsDto.MonthlyTrend(
                    rs.getString("month"),
                    rs.getInt("packages_created"),
                    rs.getBigDecimal("total_value"),
                    rs.getInt("tests_added")
            );
        }
    }
}