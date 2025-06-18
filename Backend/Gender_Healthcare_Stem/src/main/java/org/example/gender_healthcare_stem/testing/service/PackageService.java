package org.example.gender_healthcare_stem.testing.service;

import org.example.gender_healthcare_stem.testing.model.Package;
import org.example.gender_healthcare_stem.testing.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PackageService {
    @Autowired
    private PackageRepository packageRepository;

    public List<Package> getPackages() {

        return packageRepository.findAll();
    }

}
