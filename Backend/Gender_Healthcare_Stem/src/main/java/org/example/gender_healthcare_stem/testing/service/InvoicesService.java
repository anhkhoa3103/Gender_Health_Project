package org.example.gender_healthcare_stem.testing.service;

import org.example.gender_healthcare_stem.auth.model.User;
import org.example.gender_healthcare_stem.auth.repository.UserRepository;
import org.example.gender_healthcare_stem.testing.dto.InvoicesDTO;
import org.example.gender_healthcare_stem.testing.model.Invoices;
import org.example.gender_healthcare_stem.testing.repository.InvoicesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InvoicesService {
    @Autowired
    private InvoicesRepository invoicesRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Invoices> getInvoices() {
        return invoicesRepository.findAll();
    }

    public InvoicesDTO toDTO(Invoices invoice) {
        User user = userRepository.findById(invoice.getCustomerId()).orElse(null);
        String customerName = (user != null) ? user.getFullName() : "Unknown";
        String customerPhone = (user != null && user.getPhone() != null) ? user.getPhone() : "";
        return new InvoicesDTO(
                invoice.getId(),
                invoice.getCustomerId(),
                customerName,
                invoice.getAppointmentId(),
                invoice.getAmount(),
                invoice.getPaid(),
                invoice.getCreatedAt(),
                invoice.getPaymentProof(),
                invoice.getPaidItems(),
                customerPhone     // <-- set customer phone here!
        );
    }

    public List<InvoicesDTO> getAllInvoicesDTO() {
        List<Invoices> invoices = invoicesRepository.findAll();
        return invoices.stream().map(this::toDTO).toList();
    }

    public InvoicesDTO createInvoice(InvoicesDTO dto) {
        Invoices entity = new Invoices();
        entity.setCustomerId(dto.getCustomerId());
        entity.setAppointmentId(dto.getAppointmentId());
        entity.setAmount(dto.getAmount());
        entity.setPaid(dto.getPaid());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setPaymentProof(dto.getPaymentProof());
        entity.setPaidItems(dto.getPaidItems());

        Invoices saved = invoicesRepository.save(entity);

        User user = userRepository.findById(saved.getCustomerId()).orElse(null);
        String customerName = (user != null) ? user.getFullName() : "Unknown";
        String customerPhone = (user != null && user.getPhone() != null) ? user.getPhone() : "";

        return new InvoicesDTO(
                saved.getId(),
                saved.getCustomerId(),
                customerName,
                saved.getAppointmentId(),
                saved.getAmount(),
                saved.getPaid(),
                saved.getCreatedAt(),
                saved.getPaymentProof(),
                saved.getPaidItems(),
                customerPhone
        );
    }

    public InvoicesDTO updatePaidStatus(Long invoiceId, Boolean paid) {
        Invoices invoice = invoicesRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoice.setPaid(paid);
        Invoices saved = invoicesRepository.save(invoice);

        User user = userRepository.findById(saved.getCustomerId()).orElse(null);
        String customerName = (user != null) ? user.getFullName() : "Unknown";
        String customerPhone = (user != null && user.getPhone() != null) ? user.getPhone() : "";

        return new InvoicesDTO(
                saved.getId(),
                saved.getCustomerId(),
                customerName,
                saved.getAppointmentId(),
                saved.getAmount(),
                saved.getPaid(),
                saved.getCreatedAt(),
                saved.getPaymentProof(),
                saved.getPaidItems(),
                customerPhone
        );
    }
}
