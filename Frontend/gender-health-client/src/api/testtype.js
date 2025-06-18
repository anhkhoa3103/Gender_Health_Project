import axios from "axios";
import api from "./axios";

const BASE = "/api/testtype";

export const getTestTypeAxios = () => api.get(`${BASE}`);