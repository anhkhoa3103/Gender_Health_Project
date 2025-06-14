package org.example.gender_healthcare_stem.testing.dto;

import java.math.BigDecimal;
import java.util.List;

public class PackageResponse {
    private Integer packageId;
    private String packageName;
    private BigDecimal totalPrice;
    private List<TestTypeResponse> testTypes; // included tests

    //getters and setters

    public Integer getPackageId() {
        return packageId;
    }

    public void setPackageId(Integer packageId) {
        this.packageId = packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<TestTypeResponse> getTestTypes() {
        return testTypes;
    }

    public void setTestTypes(List<TestTypeResponse> testTypes) {
        this.testTypes = testTypes;
    }
}
