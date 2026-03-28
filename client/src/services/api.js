import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const submitComplaint = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await api.post('/complaints', formData, config);
  return response.data;
};

export const getComplaints = async () => {
  const response = await api.get('/complaints');
  return response.data;
};

export const updateComplaintStatus = async (id, status) => {
  const response = await api.put(`/complaints/${id}/status`, { status });
  return response.data;
};

export default api;
