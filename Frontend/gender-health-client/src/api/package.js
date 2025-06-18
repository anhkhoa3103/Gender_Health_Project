import axios from "axios";
import api from "./axios";

const BASE = "/api/package";

export const getPackagesAxios = () => axios.post(`http://localhost:8080${BASE}`,{
    headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          responseType: "json",
        },
});