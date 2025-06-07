import api from "./axios";          

const BASE = "/api/menstrual";         

/** Lưu 1 ngày */
export const saveCycleEntry = (cid, data) =>
  api.post(`${BASE}/${cid}`, data);

/** Lấy dữ liệu theo tháng */
export const getCyclesByMonth = (cid, year, month) =>
  api.get(`${BASE}/${cid}/month`, { params: { year, month } });

/** Lưu hàng loạt ngày */
export const saveBulkCycles = (cid, list) =>
  api.post(`${BASE}/${cid}/bulk`, list);

/** Lịch sử các chu kỳ */
export const getCycleHistory = (cid) =>
  api.get(`${BASE}/cycle-history/${cid}`);
