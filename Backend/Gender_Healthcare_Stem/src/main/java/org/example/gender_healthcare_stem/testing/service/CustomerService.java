// src/main/java/org/example/gender_healthcare_stem/auth/service/CustomerService.java
package org.example.gender_healthcare_stem.testing.service;

import jakarta.transaction.Transactional;
import org.example.gender_healthcare_stem.auth.model.Customer;
import org.example.gender_healthcare_stem.auth.model.User;
import org.example.gender_healthcare_stem.auth.repository.CustomerRepository;
import org.example.gender_healthcare_stem.auth.repository.UserRepository;
import org.example.gender_healthcare_stem.testing.dto.CustomerUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private UserRepository userRepository;
    public Customer getCustomerById(Long id) {
        // Optionally: handle not found with custom error
        return customerRepository.findById(id).orElse(null);
    }
    @Transactional
    public void updateCustomer(Long customerId, CustomerUpdateDTO dto) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        User user = customer.getUser();

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getAvatar() != null) user.setAvatar(dto.getAvatar());

        if (dto.getGender() != null) customer.setGender(dto.getGender());
        if (dto.getDateOfBirth() != null) customer.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getAddress() != null) customer.setAddress(dto.getAddress());

        userRepository.save(user);         // persist changes to User
        customerRepository.save(customer); // persist changes to Customer
    }

}
