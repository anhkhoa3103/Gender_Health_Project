package org.example.gender_healthcare_stem.adminservice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class StatisticsDto {

    public static class OverviewStats {
        private Integer totalPackages;
        private Integer totalTests;
        private BigDecimal averagePackagePrice;
        private BigDecimal totalValue;
        private Integer mostUsedTestId;
        private String mostUsedTestName;

        public OverviewStats() {}

        public OverviewStats(Integer totalPackages, Integer totalTests, BigDecimal averagePackagePrice,
                             BigDecimal totalValue, Integer mostUsedTestId, String mostUsedTestName) {
            this.totalPackages = totalPackages;
            this.totalTests = totalTests;
            this.averagePackagePrice = averagePackagePrice;
            this.totalValue = totalValue;
            this.mostUsedTestId = mostUsedTestId;
            this.mostUsedTestName = mostUsedTestName;
        }

        // Getters and Setters
        public Integer getTotalPackages() { return totalPackages; }
        public void setTotalPackages(Integer totalPackages) { this.totalPackages = totalPackages; }

        public Integer getTotalTests() { return totalTests; }
        public void setTotalTests(Integer totalTests) { this.totalTests = totalTests; }

        public BigDecimal getAveragePackagePrice() { return averagePackagePrice; }
        public void setAveragePackagePrice(BigDecimal averagePackagePrice) { this.averagePackagePrice = averagePackagePrice; }

        public BigDecimal getTotalValue() { return totalValue; }
        public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }

        public Integer getMostUsedTestId() { return mostUsedTestId; }
        public void setMostUsedTestId(Integer mostUsedTestId) { this.mostUsedTestId = mostUsedTestId; }

        public String getMostUsedTestName() { return mostUsedTestName; }
        public void setMostUsedTestName(String mostUsedTestName) { this.mostUsedTestName = mostUsedTestName; }
    }

    public static class PriceDistribution {
        private String priceRange;
        private Integer count;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;

        public PriceDistribution() {}

        public PriceDistribution(String priceRange, Integer count, BigDecimal minPrice, BigDecimal maxPrice) {
            this.priceRange = priceRange;
            this.count = count;
            this.minPrice = minPrice;
            this.maxPrice = maxPrice;
        }

        // Getters and Setters
        public String getPriceRange() { return priceRange; }
        public void setPriceRange(String priceRange) { this.priceRange = priceRange; }

        public Integer getCount() { return count; }
        public void setCount(Integer count) { this.count = count; }

        public BigDecimal getMinPrice() { return minPrice; }
        public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

        public BigDecimal getMaxPrice() { return maxPrice; }
        public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }
    }

    public static class PackageTestCount {
        private String packageName;
        private Integer testCount;
        private BigDecimal totalPrice;

        public PackageTestCount() {}

        public PackageTestCount(String packageName, Integer testCount, BigDecimal totalPrice) {
            this.packageName = packageName;
            this.testCount = testCount;
            this.totalPrice = totalPrice;
        }

        // Getters and Setters
        public String getPackageName() { return packageName; }
        public void setPackageName(String packageName) { this.packageName = packageName; }

        public Integer getTestCount() { return testCount; }
        public void setTestCount(Integer testCount) { this.testCount = testCount; }

        public BigDecimal getTotalPrice() { return totalPrice; }
        public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    }

    public static class TestUsage {
        private Integer testId;
        private String testName;
        private Integer usageCount;
        private BigDecimal price;
        private Double usagePercentage;

        public TestUsage() {}

        public TestUsage(Integer testId, String testName, Integer usageCount, BigDecimal price, Double usagePercentage) {
            this.testId = testId;
            this.testName = testName;
            this.usageCount = usageCount;
            this.price = price;
            this.usagePercentage = usagePercentage;
        }

        // Getters and Setters
        public Integer getTestId() { return testId; }
        public void setTestId(Integer testId) { this.testId = testId; }

        public String getTestName() { return testName; }
        public void setTestName(String testName) { this.testName = testName; }

        public Integer getUsageCount() { return usageCount; }
        public void setUsageCount(Integer usageCount) { this.usageCount = usageCount; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public Double getUsagePercentage() { return usagePercentage; }
        public void setUsagePercentage(Double usagePercentage) { this.usagePercentage = usagePercentage; }
    }

    public static class TestPriceRange {
        private String priceRange;
        private Integer count;
        private Double percentage;

        public TestPriceRange() {}

        public TestPriceRange(String priceRange, Integer count, Double percentage) {
            this.priceRange = priceRange;
            this.count = count;
            this.percentage = percentage;
        }

        // Getters and Setters
        public String getPriceRange() { return priceRange; }
        public void setPriceRange(String priceRange) { this.priceRange = priceRange; }

        public Integer getCount() { return count; }
        public void setCount(Integer count) { this.count = count; }

        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }
    }

    public static class TopPackage {
        private Integer packageId;
        private String packageName;
        private BigDecimal totalPrice;
        private Integer testCount;
        private Integer usageCount;

        public TopPackage() {}

        public TopPackage(Integer packageId, String packageName, BigDecimal totalPrice, Integer testCount, Integer usageCount) {
            this.packageId = packageId;
            this.packageName = packageName;
            this.totalPrice = totalPrice;
            this.testCount = testCount;
            this.usageCount = usageCount;
        }

        // Getters and Setters
        public Integer getPackageId() { return packageId; }
        public void setPackageId(Integer packageId) { this.packageId = packageId; }

        public String getPackageName() { return packageName; }
        public void setPackageName(String packageName) { this.packageName = packageName; }

        public BigDecimal getTotalPrice() { return totalPrice; }
        public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

        public Integer getTestCount() { return testCount; }
        public void setTestCount(Integer testCount) { this.testCount = testCount; }

        public Integer getUsageCount() { return usageCount; }
        public void setUsageCount(Integer usageCount) { this.usageCount = usageCount; }
    }

    public static class MonthlyTrend {
        private String month;
        private Integer packagesCreated;
        private BigDecimal totalValue;
        private Integer testsAdded;

        public MonthlyTrend() {}

        public MonthlyTrend(String month, Integer packagesCreated, BigDecimal totalValue, Integer testsAdded) {
            this.month = month;
            this.packagesCreated = packagesCreated;
            this.totalValue = totalValue;
            this.testsAdded = testsAdded;
        }

        // Getters and Setters
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }

        public Integer getPackagesCreated() { return packagesCreated; }
        public void setPackagesCreated(Integer packagesCreated) { this.packagesCreated = packagesCreated; }

        public BigDecimal getTotalValue() { return totalValue; }
        public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }

        public Integer getTestsAdded() { return testsAdded; }
        public void setTestsAdded(Integer testsAdded) { this.testsAdded = testsAdded; }
    }
}