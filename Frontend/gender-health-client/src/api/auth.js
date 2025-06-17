// src/api/auth.js hoặc ./api/authApi.js

import api from "./axios";

const BASE = "/api/auth";

export const register = (payload) =>
  api.post(`${BASE}/register`, payload);

export const login = (payload) =>
  api.post(`${BASE}/login`, payload);

export const loginManagement = (payload) =>
  api.post(`${BASE}/login/management`, payload);

export const logout = () =>
  api.post(`${BASE}/logout`);

export const googleLogin = (token) =>
  api.post(`${BASE}/oauth/google`, { token });

export const sendResetLink = (email) =>
  api.post(`${BASE}/forgot-password`, { email });

export const resetPassword = (body) =>
  api.post(`${BASE}/reset-password`, body);
