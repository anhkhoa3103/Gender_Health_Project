import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Thêm interceptor để đính kèm token phù hợp
api.interceptors.request.use(
  config => {
    const managementToken = localStorage.getItem('managementToken');
    const customerToken = localStorage.getItem('token');

    // Ưu tiên token quản lý nếu có (admin, consultant, staff)
    if (managementToken) {
      config.headers['Authorization'] = `Bearer ${managementToken}`;
    } else if (customerToken) {
      config.headers['Authorization'] = `Bearer ${customerToken}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Xử lý khi gặp lỗi 401 / 403
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Xóa token và chuyển về login phù hợp
      localStorage.removeItem('managementToken');
      localStorage.removeItem('token');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
