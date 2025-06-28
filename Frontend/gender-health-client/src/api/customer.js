import api from "./axios"; // Adjust the path if needed

// Lấy danh sách customer với đầy đủ thông tin user
// api/customer.js
export const getCustomerById = (id) =>
  api.get(`/api/customers/${id}`);

export const updateCustomer = (customerId, data) =>
  api.put(`/api/customers/${customerId}`, data);
