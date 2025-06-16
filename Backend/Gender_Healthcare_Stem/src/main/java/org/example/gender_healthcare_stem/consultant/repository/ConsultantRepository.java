package org.example.gender_healthcare_stem.consultant.repository;

import org.example.gender_healthcare_stem.consultant.model.Consultant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultantRepository extends JpaRepository<Consultant, Integer> {
}
