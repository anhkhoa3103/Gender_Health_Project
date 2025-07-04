package org.example.gender_healthcare_stem.consultation.repository;

import org.example.gender_healthcare_stem.consultation.model.ConsultationInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConsultationInvoiceRepository extends JpaRepository<ConsultationInvoice, Long> {
    Optional<ConsultationInvoice> findByPaymentTxnRef(String vnpTxnRef);
}
