package org.example.gender_healthcare_stem.consultation.repository;

import org.example.gender_healthcare_stem.consultation.dto.ConsultationInvoiceDTO;
import org.example.gender_healthcare_stem.consultation.model.ConsultationInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConsultationInvoiceRepository extends JpaRepository<ConsultationInvoice, Long> {
    Optional<ConsultationInvoice> findByPaymentTxnRef(String vnpTxnRef);

    void deleteByConsultation_ConsultationId(Long consultationId);

    List<ConsultationInvoice> findByConsultation_CustomerId(Long customerId);

    @Query("""
                SELECT new org.example.gender_healthcare_stem.consultation.dto.ConsultationInvoiceDTO(
                    i.id,
                    i.amount,
                    c.consultationId,
                    c.customerId,
                    i.paymentMethod,
                    i.paymentResponseCode,
                    i.paymentTime,
                    i.paymentTxnRef
                )
                FROM ConsultationInvoice i
                JOIN i.consultation c
                JOIN i.customer cu
                WHERE c.customerId = :customerId
            """)
    List<ConsultationInvoiceDTO> findDTOsByCustomerId(@Param("customerId") Long customerId);
}