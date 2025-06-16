package org.example.gender_healthcare_stem.testing.model;

import jakarta.persistence.*;

@Entity
@Table(name = "package_test")
public class PackageTest {

    @EmbeddedId
    private PackageTestId id = new PackageTestId();

    @ManyToOne
    @MapsId("packageId")
    @JoinColumn(name = "package_id")
    private Package aPackage;

    @ManyToOne
    @MapsId("testId")
    @JoinColumn(name = "test_id")
    private TestType testType;

    // Getters and Setters

    public PackageTestId getId() {
        return id;
    }

    public void setId(PackageTestId id) {
        this.id = id;
    }

    public Package getPackage() {
        return aPackage;
    }

    public void setPackage(Package aPackage) {
        this.aPackage = aPackage;
    }

    public TestType getTestType() {
        return testType;
    }

    public void setTestType(TestType testType) {
        this.testType = testType;
    }
}