package org.example.gender_healthcare_stem.adminservice.dto;

import java.util.List;

public class PackageRequest {
    private String packageName;
    private List<Integer> testIds;

    // Constructors
    public PackageRequest() {}

    public PackageRequest(String packageName, List<Integer> testIds) {
        this.packageName = packageName;
        this.testIds = testIds;
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
}
