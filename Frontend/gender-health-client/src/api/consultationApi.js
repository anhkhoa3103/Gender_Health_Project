import api from "./axios";

const BASE_CONSULTANTS = "/api/consultants";
const BASE_CONSULTATION = "/api/consultation";
const BASE_APPOINTMENTS = "/api/appointments";

/** Lấy danh sách consultants */
export const getConsultants = () => api.get(`${BASE_CONSULTANTS}/getall`);

/** Lấy các slot có sẵn */
export const getAvailableSlots = (consultantId, date) =>
  api.get(`${BASE_CONSULTATION}/available-workslots`, { params: { consultantId, date } });

/** Lấy tất cả slot */
export const getAllSlot = () => api.get(`${BASE_CONSULTATION}/slots`);

/** Tạo lịch hẹn mới */
export const createAppointment = (data) =>
  api.post(BASE_APPOINTMENTS, data);

/** Lấy lịch hẹn theo ID */
export const getUserAppointments = (userId) =>
  api.get(`${BASE_APPOINTMENTS}/user/${userId}/details`);


export const cancelAppointment = (appointmentId) =>
  api.put(`/api/appointments/${appointmentId}/cancel`);

/** Lấy feedback theo consultantId */
export const getFeedbacksByConsultantId = (consultantId) =>
  api.get(`/api/consultants/${consultantId}/feedbacks`);

export const getAppointmentsByConsultantId = (consultantId) =>
  api.get(`/api/consultants/appointments`, {
    params: { consultantId }
  });

export const getConsultantById = (consultantId) =>
  api.get(`/api/consultants/${consultantId}`);
