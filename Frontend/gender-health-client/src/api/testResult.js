import axios from 'axios';
import api from './axios'; // Your axios instance (for auth/interceptors etc.)

const BASE_URL = "http://localhost:8080";

// Get all test results (admin/staff)
export const getAllTestResults = () =>
    api.get('/api/test-results/');

// Get test result details by resultId
export const getTestResultDetail = (resultId) =>
    api.get(`/api/test-results/${resultId}/details`);

// Update a test result's detail
export const updateTestResultDetail = (resultId, details) =>
    axios.put(`${BASE_URL}/api/test-results/${resultId}/details`, { details });

// Get all test results by customerId (original API)
export const getTestResultsByCustomerId = (customerId) =>
    api.get('/api/test-results/customer', { params: { customerId } });

// Set appointment status to completed
export const setAppointmentStatusCompleted = (appointmentId) => 
    api.put(`/api/sti-appointment/staff/update-status/${appointmentId}`, { status: "completed" });

// **NEW: Get all PDF-exportable data for a customer**                                                                                  
export const getPdfDataByCustomerId = (customerId) =>
    api.get(`/api/test-results/pdf-data/customer/${customerId}`);
                                            