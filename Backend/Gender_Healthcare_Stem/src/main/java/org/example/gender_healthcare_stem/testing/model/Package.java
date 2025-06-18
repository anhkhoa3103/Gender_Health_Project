package org.example.gender_healthcare_stem.testing.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;


@Entity
@Table(name = "package")
public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Integer packageId;

    @Column(name = "package_name", nullable = false)
    private String packageName;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    // Optional: if you want to load tests inside package automatically
    @OneToMany(mappedBy = "aPackage")
    @JsonIgnore
    private List<PackageTest> packageTests;

    // Getters and Setters

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

    public List<PackageTest> getPackageTests() {
        return packageTests;
    }

    public void setPackageTests(List<PackageTest> packageTests) {
        this.packageTests = packageTests;
    }
}
