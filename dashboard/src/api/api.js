import axios from "axios";

// API configuration with environment awareness
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment ? 'http://localhost:5001' : process.env.REACT_APP_API_URL || '';

// Create axios instance with proper configuration
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true, // Enable cookies for authentication
});

// Add authorization header if token exists
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// Initialize with token from localStorage if available
const token = localStorage.getItem("token");
if (token) {
    setAuthToken(token);
}

export default api;
