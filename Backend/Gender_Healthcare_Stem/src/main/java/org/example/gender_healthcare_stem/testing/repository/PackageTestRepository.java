package org.example.gender_healthcare_stem.testing.repository;

import org.example.gender_healthcare_stem.testing.model.PackageTest;
import org.example.gender_healthcare_stem.testing.model.PackageTestId;
import org.example.gender_healthcare_stem.testing.model.TestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageTestRepository extends JpaRepository<PackageTest, PackageTestId> {
    List<PackageTest> findByAPackage_PackageId(Long packageId);
    // OR, if you want just test types:
    @Query("SELECT pt.testType FROM PackageTest pt WHERE pt.aPackage.packageId = :packageId")
    List<TestType> findTestTypesByPackageId(@Param("packageId") Long packageId);
}

