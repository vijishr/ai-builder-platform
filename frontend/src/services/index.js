import api from './api';

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  verifyEmail: (email, otp) => api.post('/auth/verify-email', { email, otp }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  resendOtp: (email) => api.post('/auth/resend-otp', { email }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
};

// Project Services
export const projectService = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getPages: (projectId) => api.get(`/projects/${projectId}/pages`),
  addPage: (projectId, data) => api.post(`/projects/${projectId}/pages`, data),
  updatePage: (projectId, pageId, data) => api.put(`/projects/${projectId}/pages/${pageId}`, data),
  deletePage: (projectId, pageId) => api.delete(`/projects/${projectId}/pages/${pageId}`)
};

// AI Services
export const aiService = {
  generateWebsite: (data) => api.post('/ai/generate-website', data),
  generateApp: (data) => api.post('/ai/generate-app', data),
  generateContent: (data) => api.post('/ai/generate-content', data),
  generateCode: (data) => api.post('/ai/generate-code', data),
  generateLogo: (data) => api.post('/ai/generate-logo', data),
  analyzeProject: (data) => api.post('/ai/analyze-project', data)
};

// Deployment Services
export const deploymentService = {
  publish: (data) => api.post('/deployment/publish', data),
  getStatus: (deploymentId) => api.get(`/deployment/${deploymentId}/status`),
  rollback: (data) => api.post('/deployment/rollback', data),
  getHistory: (projectId) => api.get(`/deployment/${projectId}/history`),
  setupDomain: (data) => api.post('/deployment/setup-domain', data),
  exportCode: (data) => api.post('/deployment/export-code', data),
  getAnalytics: (projectId) => api.get(`/deployment/${projectId}/analytics`)
};

// Dashboard Services
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentProjects: () => api.get('/dashboard/recent-projects'),
  getAnalytics: () => api.get('/dashboard/analytics'),
  getFormSubmissions: () => api.get('/dashboard/form-submissions'),
  getUsers: () => api.get('/dashboard/users'),
  updateUserRole: (userId, role) => api.post(`/dashboard/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/dashboard/users/${userId}`),
  getApiKeys: () => api.get('/dashboard/api-keys'),
  generateApiKey: (data) => api.post('/dashboard/api-keys', data),
  deleteApiKey: (keyId) => api.delete(`/dashboard/api-keys/${keyId}`),
  getLogs: () => api.get('/dashboard/logs')
};

export default {
  authService,
  projectService,
  aiService,
  deploymentService,
  dashboardService
};
