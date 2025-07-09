package org.example.gender_healthcare_stem.consultation.controller;

import org.example.gender_healthcare_stem.consultation.dto.ConsultationInvoiceDTO;
import org.example.gender_healthcare_stem.consultation.model.ConsultationInvoice;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationInvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/consultation-invoices")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ConsultationInvoiceController {

    @Autowired
    private ConsultationInvoiceRepository invoiceRepository;

    @GetMapping("/customer/{customerId}")
    public List<ConsultationInvoiceDTO> getInvoicesByCustomerId(@PathVariable Long customerId) {
        return invoiceRepository.findByConsultation_CustomerId(customerId).stream()
                .map(inv -> {
                    ConsultationInvoiceDTO dto = new ConsultationInvoiceDTO();
                    dto.setConsultationInvoiceId(inv.getId());
                    dto.setAmount(inv.getAmount());
                    dto.setConsultationId(inv.getConsultation().getConsultationId());
                    dto.setCustomerId(inv.getCustomer().getCustomerId());
                    dto.setPaymentMethod(inv.getPaymentMethod());
                    dto.setPaymentResponseCode(inv.getPaymentResponseCode());
                    dto.setPaymentTime(inv.getPaymentTime());
                    dto.setPaymentTxnRef(inv.getPaymentTxnRef());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
