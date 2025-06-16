package org.example.gender_healthcare_stem.testing.model;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

//Do package test là bảng tự tạo để liến kết package và test type nên sẽ phải tạo bảng package test
//Do package test dùng 2 khóa ngoại làm khóa chính kép nên là phải dùng @Embedded
@Embeddable
public class PackageTestId implements Serializable {

    private Integer packageId;
    private Integer testId;

    // Constructors
    public PackageTestId() {}

    public PackageTestId(Integer packageId, Integer testId) {
        this.packageId = packageId;
        this.testId = testId;
    }

    // Getters and Setters
    public Integer getPackageId() {
        return packageId;
    }

    public void setPackageId(Integer packageId) {
        this.packageId = packageId;
    }

    public Integer getTestId() {
        return testId;
    }

    public void setTestId(Integer testId) {
        this.testId = testId;
    }

    // hashCode and equals (REQUIRED)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PackageTestId that)) return false;
        return Objects.equals(packageId, that.packageId) &&
                Objects.equals(testId, that.testId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(packageId, testId);
    }
}