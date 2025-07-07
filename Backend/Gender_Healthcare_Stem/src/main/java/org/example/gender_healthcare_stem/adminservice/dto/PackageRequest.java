package org.example.gender_healthcare_stem.adminservice.dto;

import java.math.BigDecimal;
import java.util.List;

public class PackageRequest {
    private String packageName;
    private List<Integer> testIds;
    private BigDecimal totalPrice;

    // Constructors
    public PackageRequest() {}

    public PackageRequest(String packageName, List<Integer> testIds, BigDecimal totalPrice) {
        this.packageName = packageName;
        this.testIds = testIds;
        this.totalPrice = totalPrice;
    }

    // Getters and Setters
    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public List<Integer> getTestIds() {
        return testIds;
    }

    public void setTestIds(List<Integer> testIds) {
        this.testIds = testIds;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}