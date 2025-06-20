package org.example.gender_healthcare_stem.testing.repository;

import org.example.gender_healthcare_stem.testing.model.Invoices;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoices, Long> {
    // Find invoice by appointment ID
    Optional<Invoices> findByAppointmentId(Integer appointmentId);
    // Optional: Find all invoices for a customer
    List<Invoices> findByCustomerId(Long customerId);

    // Optional: Filter by payment status
    List<Invoices> findByPaid(boolean paid);
}
