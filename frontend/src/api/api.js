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

// Add CSRF token and auth token to requests
api.interceptors.request.use(config => {
  // Add CSRF token if available
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN'))
    ?.split('=')[1];

  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  // Add customer token from localStorage if available
  const customerToken = localStorage.getItem('customerToken');
  if (customerToken) {
    config.headers['Authorization'] = `Bearer ${customerToken}`;
  }

  return config;
});

// Handle token refresh and error responses
api.interceptors.response.use(
  response => response,
  async error => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      try {
        // Try to refresh the token
        await api.post('/auth/refresh-token');
        return api(error.config);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear token and redirect to login
        localStorage.removeItem('customerToken');
        window.location.href = '/login';
      }
    }

    // Log all API errors for debugging
    console.error('API Error:', error.response?.status, error.response?.data);

    return Promise.reject(error);
  }
);

export default api;

