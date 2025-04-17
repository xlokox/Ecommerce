import axios from 'axios';

// Use a default URL if the environment variable is not set
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
console.log('Using API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add CSRF token to requests
api.interceptors.request.use(config => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN'))
    ?.split('=')[1];

  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        await api.post('/auth/refresh-token');
        return api(error.config);
      } catch (refreshError) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

