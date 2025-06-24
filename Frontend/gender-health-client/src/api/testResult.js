import axios from 'axios';
import api from './axios'; // Your axios instance (for auth/interceptors etc.)

const BASE_URL = "http://localhost:8080"; // Update this if your backend URL is different

// Get all test results (using your custom api instance)
export const getAllTestResults = () =>
    api.get('/api/test-results/');
export const getTestResultDetail = (resultId) => api.get(`/api/test-results/${resultId}/details`);
export const updateTestResultDetail = (resultId, details) => {
  return axios.put(`${BASE_URL}/api/test-results/${resultId}/details`, { details });
};