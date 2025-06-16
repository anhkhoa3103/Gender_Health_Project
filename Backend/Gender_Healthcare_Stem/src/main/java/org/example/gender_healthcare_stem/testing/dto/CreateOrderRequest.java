package org.example.gender_healthcare_stem.testing.dto;

import java.math.BigDecimal;
import java.util.List;

public class CreateOrderRequest {
    private Long customerId;
    private Integer packageId; // optional
    private List<Integer> testTypeIds; // optional
    private BigDecimal amount;

    // Getters and Setters

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Integer getPackageId() {
        return packageId;
    }

    public void setPackageId(Integer packageId) {
        this.packageId = packageId;
    }

    public List<Integer> getTestTypeIds() {
        return testTypeIds;
    }

    public void setTestTypeIds(List<Integer> testTypeIds) {
        this.testTypeIds = testTypeIds;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
