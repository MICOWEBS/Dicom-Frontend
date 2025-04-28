import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const instance = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
instance.interceptors.request.use(
  (config) => {
    // Skip auth for static files and manifest
    if (config.url?.includes('/static/') || config.url === '/manifest.json') {
      return config;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Applying token to request:', token);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found for request');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Only redirect to login if not already on login page
          if (!window.location.pathname.includes('/login')) {
            console.log('Token expired or invalid, redirecting to login');
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred:', error.response.data);
      }
    } else if (error.request) {
      // Handle network errors
      console.error('Network error:', error.request);
    } else {
      // Handle other errors
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance; 