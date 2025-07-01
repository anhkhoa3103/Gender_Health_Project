import axios from "axios";
import api from "./axios";

const BASE = "/api/invoice";

// Use GET and pass headers as 2nd param
export const getInvoicesAxios = () => 
  axios.get(`http://localhost:8080${BASE}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      // Add this if you require token
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    responseType: "json",
  });

// This one is correct (using your custom api instance)
export const updateInvoicePaidStatus = (invoiceId, paid) =>
  api.put(`/api/invoice/${invoiceId}/paid`, { paid });