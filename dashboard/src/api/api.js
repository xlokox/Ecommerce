import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Function to safely get token from localStorage
const getToken = () => {
  try {
    return localStorage.getItem('accessToken') || '';
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return '';
  }
};

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Send token with Bearer prefix
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request');
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);

    // Handle authentication errors
    if (error.response) {
      if (error.response.status === 401) {
        // If unauthorized, clear token and redirect to login
        localStorage.removeItem('accessToken');
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        // Forbidden - redirect to unauthorized page
        window.location.href = '/unauthorized';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
