package org.example.gender_healthcare_stem.testing.repository;

import org.example.gender_healthcare_stem.testing.model.Invoices;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoicesRepository extends JpaRepository<Invoices, Long> {
    List<Invoices> findAll();

}
