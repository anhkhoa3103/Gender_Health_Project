package org.example.gender_healthcare_stem.testing.service;

import org.example.gender_healthcare_stem.testing.model.TestType;
import org.example.gender_healthcare_stem.testing.repository.PackageTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PackageTestService {
    private final PackageTestRepository packageTestRepository;

    @Autowired
    public PackageTestService(PackageTestRepository packageTestRepository) {
        this.packageTestRepository = packageTestRepository;
    }

    public List<TestType> getTestTypesForPackage(Long packageId) {
        return packageTestRepository.findTestTypesByPackageId(packageId);
    }
}
