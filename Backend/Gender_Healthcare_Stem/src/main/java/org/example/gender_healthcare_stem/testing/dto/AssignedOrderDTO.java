package org.example.gender_healthcare_stem.testing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignedOrderDTO {
    private Integer appointmentId;
    private Long customerId;
    private String customerName; // nếu join được với bảng user/customer
    private String status; // completed, pending
    private BigDecimal amount;

//    private String appointmentDate; // Nếu có, có thể thêm trường từ bảng test_result hoặc invoice.created_at

    //private String packageName; // Nếu đặt theo gói
    private List<String> testNames; // Các test riêng lẻ hoặc thuộc gói

    private Boolean paid;
    private String paymentProof;
}
