import axios from "axios";
import api from "./axios";

const BASE = "/api/invoice";

export const getInvoicesAxios = () => axios.post(`http://localhost:8080${BASE}`,{
    headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          responseType: "json",
        },
}

);
export const updateInvoicePaidStatus = (invoiceId, paid) =>
  api.put(`/api/invoice/${invoiceId}/paid`, { paid });

