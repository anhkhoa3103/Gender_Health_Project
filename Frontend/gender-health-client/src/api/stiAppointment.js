import axios from 'axios';
import api from './axios';

export const getAllAppointments = () =>
    api.get('/api/sti-appointment/staff/all');
const BASE_URL = "http://localhost:8080"; // <-- backend URL

export const updateAppointmentStatus = (appointmentId, status, staffId, config = {}) =>
    axios.put(
        `${BASE_URL}/api/sti-appointment/staff/update-status/${appointmentId}`,
        { status, staffId },
        config
    );
export const setAppointmentStatusCompleted = (appointmentId) => 
  api.put(`/api/sti-appointment/staff/update-status/${appointmentId}`, { status: "completed" });
