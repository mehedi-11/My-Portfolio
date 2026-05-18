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

  getSkills: () => api.get('/skills'),
  addSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),

  // Critical: getSettings must be here for PortfolioContext
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
};

export const messageAPI = {
  getContacts: () => api.get('/contacts'),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
  sendContact: (data) => api.post('/contacts', data),
  
  getProposals: () => api.get('/hire'),
  deleteProposal: (id) => api.delete(`/hire/${id}`),
  sendProposal: (data) => api.post('/hire', data),
};

export const notifyAPI = {
  getCounts: () => api.get('/notifications/count'),
  markRead: (type) => api.post('/notifications/mark-read', { type }),
};

// Also exporting as settingsAPI for backward compatibility in Admin components
export const settingsAPI = {
  getSettings: portfolioAPI.getSettings,
  updateSettings: portfolioAPI.updateSettings,
  getActivityLogs: () => api.get('/activity-logs'),
  clearActivityLogs: () => api.delete('/activity-logs'),
};

export const blogAPI = {
  getBlogs: () => api.get('/blogs'),
  getBlog: (slug) => api.get(`/blogs/${slug}`),
  addBlog: (formData) => api.post('/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBlog: (id, formData) => api.put(`/blogs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
};

export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics'),
};

export const backupAPI = {
  exportBackup: () => api.get('/backup', { responseType: 'blob' }),
  restoreBackup: (data) => api.post('/backup/restore', data),
};

export default api;
