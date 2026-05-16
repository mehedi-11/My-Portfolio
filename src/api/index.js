import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const portfolioAPI = {
  getAll: () => api.get('/portfolio'),
  getProjects: () => api.get('/projects'),
  addProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  
  getExperience: () => api.get('/experience'),
  addExperience: (data) => api.post('/experience', data),
  updateExperience: (id, data) => api.put(`/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/experience/${id}`),
  
  getEducation: () => api.get('/education'),
  addEducation: (data) => api.post('/education', data),
  updateEducation: (id, data) => api.put(`/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/education/${id}`),
};

export const messageAPI = {
  getContacts: () => api.get('/contacts'),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
  sendContact: (data) => api.post('/contacts', data),
  
  getProposals: () => api.get('/hire'),
  deleteProposal: (id) => api.delete(`/hire/${id}`),
  sendProposal: (data) => api.post('/hire', data),
};

export default api;
