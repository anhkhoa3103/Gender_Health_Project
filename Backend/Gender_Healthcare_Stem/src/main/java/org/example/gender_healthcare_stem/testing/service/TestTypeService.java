package org.example.gender_healthcare_stem.testing.service;

import org.example.gender_healthcare_stem.testing.model.TestType;
import org.example.gender_healthcare_stem.testing.repository.TestTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestTypeService {
    @Autowired
    private TestTypeRepository testTypeRepository;

    public List<TestType> getTestTypes() {

        return testTypeRepository.findAll();
    }
}
