import api from "./axios"; 

const BASE = "/api/admin";

// Lấy tất cả users
export const getAllUsers = () =>
  api.get(`${BASE}/users`);

// Tìm user theo tên
export const findUsersByName = (keyword) =>
  api.get(`${BASE}/users/search`, {
    params: { name: keyword },
  });

// Cập nhật user
export const updateUser = (userId, payload) =>
  api.put(`${BASE}/users/${userId}`, payload);

// Xóa user (tuỳ bạn có implement xoá hay không)
export const deleteUser = (userId) =>
  api.delete(`${BASE}/users/${userId}`);

// Lấy tất cả feedbacks
export const getAllFeedbacks = () => 
  api.get(`${BASE}/feedbacks`);
