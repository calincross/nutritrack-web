import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

export const mealsAPI = {
  getAll: () => api.get('/meals'),
  getByDate: (date: string) => api.get(`/meals?date=${date}`),
  getByDateRange: (startDate: string, endDate: string) =>
    api.get(`/meals?startDate=${startDate}&endDate=${endDate}`),
  create: (meal: any) => api.post('/meals', meal),
  update: (id: string, meal: any) => api.put(`/meals/${id}`, meal),
  delete: (id: string) => api.delete(`/meals/${id}`),
};

export const recipesAPI = {
  getAll: () => api.get('/recipes'),
  search: (query: string) => api.get(`/recipes/search?q=${query}`),
  create: (recipe: any) => api.post('/recipes', recipe),
  update: (id: string, recipe: any) => api.put(`/recipes/${id}`, recipe),
  delete: (id: string) => api.delete(`/recipes/${id}`),
};

export const documentsAPI = {
  getAll: () => api.get('/documents'),
  getByType: (type: string) => api.get(`/documents?type=${type}`),
  upload: (formData: FormData) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

export const userAPI = {
  updateProfile: (data: any) => api.put('/user/profile', data),
  updateCalorieGoal: (goal: number) =>
    api.put('/user/calorie-goal', { dailyCalorieGoal: goal }),
  updateDietType: (dietType: string) =>
    api.put('/user/diet-type', { dietType }),
};

export default api;
