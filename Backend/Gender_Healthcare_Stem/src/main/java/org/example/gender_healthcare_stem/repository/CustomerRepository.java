package org.example.gender_healthcare_stem.repository;

import org.example.gender_healthcare_stem.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
