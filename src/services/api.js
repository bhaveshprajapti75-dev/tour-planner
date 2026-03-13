import axios from 'axios';

const API_BASE = import.meta.env.PROD
  ? 'https://tour-planner-ibzz.onrender.com/api/v1'
  : (import.meta.env.VITE_API_BASE_URL || '/api/v1');

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 & 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || (status === 403 && !localStorage.getItem('access_token'))) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Clear zustand persisted auth state
      localStorage.removeItem('tour-planner-auth');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;

// ==================== AUTH ====================
export const authAPI = {
  login: (email, password) => api.post('/account/users/login/', { email, password }),
  register: (data) => api.post('/account/users/register/', data),
  logout: (refresh) => api.post('/account/users/logout/', { refresh }),
};

// ==================== GEOGRAPHY ====================
export const geographyAPI = {
  // Countries
  getCountries: (params) => api.get('/geography/countries/', { params }),
  getCountry: (id) => api.get(`/geography/countries/${id}/`),
  createCountry: (data) => api.post('/geography/countries/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateCountry: (id, data) => api.patch(`/geography/countries/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteCountry: (id) => api.delete(`/geography/countries/${id}/`),
  bulkUploadCountries: (formData) => api.post('/geography/countries/bulk-upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Regions
  getRegions: (params) => api.get('/geography/regions/', { params }),
  getRegion: (id) => api.get(`/geography/regions/${id}/`),
  createRegion: (data) => api.post('/geography/regions/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateRegion: (id, data) => api.patch(`/geography/regions/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteRegion: (id) => api.delete(`/geography/regions/${id}/`),
  bulkUploadRegions: (formData) => api.post('/geography/regions/bulk-upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ==================== ATTRACTIONS ====================
export const attractionsAPI = {
  getAttractions: (params) => api.get('/attractions/attract/', { params }),
  getAttraction: (id) => api.get(`/attractions/attract/${id}/`),
  createAttraction: (data) => api.post('/attractions/attract/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateAttraction: (id, data) => api.patch(`/attractions/attract/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAttraction: (id) => api.delete(`/attractions/attract/${id}/`),
  bulkUpload: (formData) => api.post('/attractions/attract/bulk-upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ==================== DAY TOURS ====================
export const dayToursAPI = {
  getDayTours: (params) => api.get('/day-tours/day/', { params }),
  getDayTour: (id) => api.get(`/day-tours/day/${id}/`),
  createDayTour: (data) => api.post('/day-tours/day/', data),
  updateDayTour: (id, data) => api.patch(`/day-tours/day/${id}/`, data),
  deleteDayTour: (id) => api.delete(`/day-tours/day/${id}/`),
  addAttractions: (id, data) => api.post(`/day-tours/day/${id}/add_attractions/`, data),
  removeAttraction: (data) => api.post('/day-tours/day/remove_attraction/', data),
  bulkUpload: (formData) => api.post('/day-tours/day/bulk-upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ==================== HOTELS ====================
export const hotelsAPI = {
  getHotels: (params) => api.get('/hotel/hotels/', { params }),
  getHotel: (id) => api.get(`/hotel/hotels/${id}/`),
  createHotel: (data) => api.post('/hotel/hotels/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateHotel: (id, data) => api.patch(`/hotel/hotels/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteHotel: (id) => api.delete(`/hotel/hotels/${id}/`),
  bulkUpload: (formData) => api.post('/hotel/hotels/bulk-upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ==================== INCLUSIONS ====================
export const inclusionsAPI = {
  // Categories
  getCategories: (params) => api.get('/inclusions/categories/', { params }),
  createCategory: (data) => api.post('/inclusions/categories/', data),
  updateCategory: (id, data) => api.patch(`/inclusions/categories/${id}/`, data),
  deleteCategory: (id) => api.delete(`/inclusions/categories/${id}/`),

  // Items
  getItems: (params) => api.get('/inclusions/exclusions/', { params }),
  getGrouped: (params) => api.get('/inclusions/exclusions/grouped/', { params }),
  createItem: (data) => api.post('/inclusions/exclusions/', data),
  updateItem: (id, data) => api.patch(`/inclusions/exclusions/${id}/`, data),
  deleteItem: (id) => api.delete(`/inclusions/exclusions/${id}/`),
};

// ==================== ITINERARY TEMPLATES ====================
export const templatesAPI = {
  getAvailableDays: (params) => api.get('/itinerary-templates/templates/available_days/', { params }),
  getTemplates: (params) => api.get('/itinerary-templates/templates/', { params }),
  getTemplate: (id) => api.get(`/itinerary-templates/templates/${id}/`),
  createTemplate: (data) => api.post('/itinerary-templates/templates/', data),
  updateTemplate: (id, data) => api.patch(`/itinerary-templates/templates/${id}/`, data),
  deleteTemplate: (id) => api.delete(`/itinerary-templates/templates/${id}/`),
  addDay: (id, data) => api.post(`/itinerary-templates/templates/${id}/add_day/`, data),
  attachInclusion: (id, data) => api.post(`/itinerary-templates/templates/${id}/attach_inclusion/`, data),
  removeInclusion: (id, data) => api.post(`/itinerary-templates/templates/${id}/remove_inclusion/`, data),

  getDays: (params) => api.get('/itinerary-templates/days/', { params }),
  updateDay: (id, data) => api.patch(`/itinerary-templates/days/${id}/`, data),
  deleteDay: (id) => api.delete(`/itinerary-templates/days/${id}/`),
  setDefaultTemplate: (id) => api.post(`/itinerary-templates/templates/${id}/set_as_default/`),
};

// ==================== USER PLANS ====================
export const plansAPI = {
  getPlans: (params) => api.get('/user-plans/plans/', { params }),
  getPlan: (id) => api.get(`/user-plans/plans/${id}/`),
  createPlan: (data) => api.post('/user-plans/plans/', data),
  updatePlan: (id, data) => api.patch(`/user-plans/plans/${id}/`, data),
  deletePlan: (id) => api.delete(`/user-plans/plans/${id}/`),
  clonePlan: (id) => api.post(`/user-plans/plans/${id}/clone/`),

  // Plan Days
  getPlanDays: (params) => api.get('/user-plans/plan-days/', { params }),
  createPlanDay: (data) => api.post('/user-plans/plan-days/', data),
  updatePlanDay: (id, data) => api.patch(`/user-plans/plan-days/${id}/`, data),
  deletePlanDay: (id) => api.delete(`/user-plans/plan-days/${id}/`),

  // Plan Inclusions/Exclusions
  getPlanInclExcl: (params) => api.get('/user-plans/plan-incl/', { params }),
  createPlanInclExcl: (data) => api.post('/user-plans/plan-incl/', data),
  deletePlanInclExcl: (id) => api.delete(`/user-plans/plan-incl/${id}/`),

  // New workflow actions
  autoGenerateDraft: (data) => api.post('/user-plans/plans/auto_generate_draft/', data),
  finalizePlan: (id) => api.post(`/user-plans/plans/${id}/finalize/`),
  exportPdf: (id) => api.get(`/user-plans/plans/${id}/export_pdf/`, { responseType: 'blob' }),
};

// ==================== AUDIT ====================
export const auditAPI = {
  getLogs: (params) => api.get('/audit/audit-logs/', { params }),
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getStats: () => api.get('/common/admin-dashboard/stats/'),
};

// ==================== USERS ====================
export const usersAPI = {
  getUsers: (params) => api.get('/account/users/', { params }),
  getUser: (id) => api.get(`/account/users/${id}/`),
  createUser: (data) => api.post('/account/users/', data),
  updateUser: (id, data) => api.patch(`/account/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/account/users/${id}/`),
};
