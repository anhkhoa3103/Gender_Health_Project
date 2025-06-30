// src/api/feedbackApi.js
import api from './axios'; // ✅ import file axios bạn đã cấu hình

export const submitFeedback = (feedback) => {
  return api.post('/api/feedbacks', feedback); // dùng api thay vì axios
};

export const getFeedbackByConsultant = (consultantId) => {
  return api.get(`/api/feedbacks/consultant/${consultantId}`);
};

export const getFeedbackByCustomer = (customerId) => {
  return api.get(`/api/feedbacks/customer/${customerId}`);
};

export const updateFeedback = (feedbackId, updatedData) => {
  return api.put(`/api/feedbacks/${feedbackId}`, updatedData);
};

export const getFeedbackByConsultationId = (consultationId) =>
  api.get(`/api/feedbacks/consultation/${consultationId}`);

export const getRatingSummaryByConsultantId = (consultantId) => {
  return api.get(`/api/feedbacks/rating-summary/${consultantId}`);
};