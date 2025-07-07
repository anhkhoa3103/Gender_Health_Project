package org.example.gender_healthcare_stem.consultation.controller;

import org.example.gender_healthcare_stem.consultation.model.ConsultationInvoice;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationInvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/consultation-invoices")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ConsultationInvoiceController {

    @Autowired
    private ConsultationInvoiceRepository invoiceRepository;

    @GetMapping("/customer/{customerId}")
    public List<ConsultationInvoice> getInvoicesByCustomerId(@PathVariable Long customerId) {
        return invoiceRepository.findByConsultation_CustomerId(customerId);
    }
}
