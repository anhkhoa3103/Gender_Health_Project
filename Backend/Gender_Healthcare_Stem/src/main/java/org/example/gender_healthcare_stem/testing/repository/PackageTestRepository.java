package org.example.gender_healthcare_stem.testing.repository;

import org.example.gender_healthcare_stem.testing.model.PackageTest;
import org.example.gender_healthcare_stem.testing.model.PackageTestId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PackageTestRepository extends JpaRepository<PackageTest, PackageTestId> {
    List<PackageTest> findByAPackage_PackageId(Integer packageId);
}
