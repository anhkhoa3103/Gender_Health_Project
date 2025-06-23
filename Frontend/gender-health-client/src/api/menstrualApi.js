import api from "./axios";

const BASE = "/api/menstrual";

export const saveCycleEntry = (cid, data) => {
  if (!cid) return Promise.reject("Invalid customer id");
  return api.post(`${BASE}/${cid}`, data);
};

export const getCyclesByMonth = (cid, year, month) => {
  if (!cid) return Promise.reject("Invalid customer id");
  return api.get(`${BASE}/${cid}/month`, { params: { year, month } });
};

export const saveBulkCycles = (cid, list) => {
  if (!cid) return Promise.reject("Invalid customer id");
  return api.post(`${BASE}/${cid}/bulk`, list);
};

export const getCycleHistory = (cid) => {
  if (!cid) return Promise.reject("Invalid customer id");
  return api.get(`${BASE}/cycle-history/${cid}`);
};

export const getLatestCycle = (cid) => {
  if (!cid) return Promise.reject("Invalid customer id");
  return api.get(`${BASE}/${cid}/latest-cycle`);
};

