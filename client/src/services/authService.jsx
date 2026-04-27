import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

export const loginUser = (data) =>
  axios.post(`${API_BASE}/api/auth/login`, data);

export const registerUser = (data) =>
  axios.post(`${API_BASE}/api/auth/register`, data);
