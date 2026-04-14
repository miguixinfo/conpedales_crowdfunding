import axios from 'axios';

const API_URL = 'http://localhost:9090/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const donationsApi = {
  getAll: (tripId?: number) =>
    api.get('/admin/donations', { params: { tripId } }),
};

export const stagesApi = {
  getAll: () => api.get('/admin/stages'),
  create: (data: any) => api.post('/admin/stages', data),
  update: (id: number, data: any) => api.put(`/admin/stages/${id}`, data),
  delete: (id: number) => api.delete(`/admin/stages/${id}`),
};

export const waypointsApi = {
  getAll: () => api.get('/admin/waypoints'),
  create: (data: any) => api.post('/admin/waypoints', data),
  update: (id: number, data: any) => api.put(`/admin/waypoints/${id}`, data),
  delete: (id: number) => api.delete(`/admin/waypoints/${id}`),
};

export const tripApi = {
  get: (id: number) => api.get(`/admin/trip/${id}`),
  update: (id: number, data: any) => api.put(`/admin/trip/${id}`, data),
};

export const previousTripsApi = {
  getAll: () => api.get('/admin/previous-trips'),
  create: (data: any) => api.post('/admin/previous-trips', data),
  update: (id: number, data: any) => api.put(`/admin/previous-trips/${id}`, data),
  delete: (id: number) => api.delete(`/admin/previous-trips/${id}`),
};

export const settingsApi = {
  update: (clave: string, data: any) => api.put(`/admin/settings/${clave}`, data),
  getAll: () => api.get('/admin/settings'),
};

export const metricsApi = {
  update: (tripId: number, data: any) => api.put(`/admin/metrics/${tripId}`, data),
};

export const publicApi = {
  getTrip: () => api.get('/public/trip'),
  getStages: () => api.get('/public/stages'),
  getWaypoints: () => api.get('/public/waypoints'),
  getDonations: () => api.get('/public/donations'),
  getSettings: () => api.get('/public/settings'),
  getPreviousTrips: () => api.get('/public/previous-trips'),
};

export default api;
