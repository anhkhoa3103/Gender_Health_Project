package org.example.gender_healthcare_stem.testing.repository;

import jakarta.persistence.LockModeType;
import org.example.gender_healthcare_stem.testing.model.Invoices;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvoicesRepository extends JpaRepository<Invoices, Long> {
    List<Invoices> findAll();
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Invoices findByPaymentTxnRef(String paymentTxnRef);
    @Query("SELECT i FROM Invoices i WHERE i.customerId = :customerId AND i.paid = false AND i.amount = :amount AND i.paidItems = :paidItems")
    Optional<Invoices> findUnpaidInvoice(
            @Param("customerId") Long customerId,
            @Param("amount") double amount,
            @Param("paidItems") String paidItems
    );
    Invoices findTop1ByCustomerIdAndPaidOrderByCreatedAtDesc(Long customerId, boolean b);
}