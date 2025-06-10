package org.example.gender_healthcare_stem.auth.repository;

import org.example.gender_healthcare_stem.auth.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
