package org.example.gender_healthcare_stem.testing.dto;// src/main/java/org/example/gender_healthcare_stem/testing/dto/InvoiceRequestDTO.java
import lombok.Data;
import java.util.List;

@Data
public class InvoicesRequestDTO {
    private Long customerId;
    private Long appointmentId;
    private Double amount;
    private Boolean paid;
    private String paymentProof;
    private List<PaidItemDTO> paidItems;

    @Data
    public static class PaidItemDTO {
        private Long testId;
        private String testName;
        private Double price;
    }
}
