package org.example.gender_healthcare_stem.adminservice.dto;

import java.math.BigDecimal;
import java.util.List;

public class TestPackageDto {
    private Integer packageId;
    private String packageName;
    private BigDecimal totalPrice;
    private List<TestType> testTypes;

    public TestPackageDto() {
    }

    public TestPackageDto(Integer packageId, String packageName, BigDecimal totalPrice) {
        this.packageId = packageId;
        this.packageName = packageName;
        this.totalPrice = totalPrice;
    }

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

    public List<TestType> getTestTypes() {
        return testTypes;
    }

    public void setTestTypes(List<TestType> testTypes) {
        this.testTypes = testTypes;
    }
}
