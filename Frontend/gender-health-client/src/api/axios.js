// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Thêm interceptor để tự động đính kèm token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response, // nếu thành công thì trả response về bình thường
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Xóa token, logout người dùng, chuyển về login
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login'; // chuyển về trang login
    }
    return Promise.reject(error);
  }
);

export default api;
