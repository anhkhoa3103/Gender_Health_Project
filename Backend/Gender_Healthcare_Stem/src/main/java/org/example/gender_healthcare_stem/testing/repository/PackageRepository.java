package org.example.gender_healthcare_stem.testing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.example.gender_healthcare_stem.testing.model.Package;

import java.util.List;

public interface PackageRepository extends JpaRepository<Package, Integer> {
    List<Package> findAll();
}
