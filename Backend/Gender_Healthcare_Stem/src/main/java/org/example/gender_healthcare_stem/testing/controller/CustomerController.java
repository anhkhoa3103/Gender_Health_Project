package org.example.gender_healthcare_stem.testing.controller;

import org.example.gender_healthcare_stem.auth.model.Customer;
import org.example.gender_healthcare_stem.auth.model.User;
import org.example.gender_healthcare_stem.testing.dto.CustomerUpdateDTO;
import org.example.gender_healthcare_stem.testing.dto.CustomerUserDTO;
import org.example.gender_healthcare_stem.testing.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // GET: Get customer info by ID
    @GetMapping("/{id}")
    public CustomerUserDTO getCustomerById(@PathVariable Long id) {
        Customer customer = customerService.getCustomerById(id);
        User user = customer.getUser();

        CustomerUserDTO dto = new CustomerUserDTO();
        dto.setCustomerId(customer.getId());
        dto.setGender(customer.getGender());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setAddress(customer.getAddress());
        if (user != null) {
            dto.setFullName(user.getFullName());
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getPhone());
            dto.setAvatar(user.getAvatar());
            dto.setRole(user.getRole());
            dto.setStatus(user.getStatus());
            dto.setCreatedAt(user.getCreatedAt());
        }
        return dto;
    }


    // PUT: Update customer info by ID
    @PutMapping("/{id}")
    public void updateCustomer(@PathVariable Long id, @RequestBody CustomerUpdateDTO dto) {
        customerService.updateCustomer(id, dto);
    }
}