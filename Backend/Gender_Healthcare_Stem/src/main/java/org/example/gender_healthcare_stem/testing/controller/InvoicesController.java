package org.example.gender_healthcare_stem.testing.controller;


import org.example.gender_healthcare_stem.testing.dto.InvoicesDTO;
import org.example.gender_healthcare_stem.testing.model.Invoices;
import org.example.gender_healthcare_stem.testing.service.InvoicesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoice")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InvoicesController {
    private static final Logger log = LoggerFactory.getLogger(InvoicesController.class);

    /*@Autowired
    private InvoicesService service;

    @PostMapping("")
    public ResponseEntity<List<Invoices>> GetInvoices() {
        List<Invoices> invoices = service.getInvoices();
        return ResponseEntity.ok(invoices);
    }*/
    @Autowired
    private InvoicesService invoicesService;

    @PostMapping("")
    public ResponseEntity<List<InvoicesDTO>> getAllInvoices() {
        return ResponseEntity.ok(invoicesService.getAllInvoicesDTO());
    }
    @PostMapping("/create-invoice")
    public ResponseEntity<InvoicesDTO> createInvoice(@RequestBody InvoicesDTO dto) {
        InvoicesDTO created = invoicesService.createInvoice(dto);
        return ResponseEntity.ok(created);
    }
    @PutMapping("/{invoiceId}/paid")
    public ResponseEntity<InvoicesDTO> updatePaidStatus(
            @PathVariable Long invoiceId,
            @RequestBody Map<String, Boolean> body
    ) {
        Boolean paid = body.get("paid");
        InvoicesDTO updated = invoicesService.updatePaidStatus(invoiceId, paid);
        return ResponseEntity.ok(updated);
    }

}
