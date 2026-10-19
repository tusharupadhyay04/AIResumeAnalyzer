import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});


// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle expired/invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const code = error.response.data?.code;
      if (code === 'TOKEN_EXPIRED' || code === 'TOKEN_INVALID') {
        // Clear stale token and force re-login
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
