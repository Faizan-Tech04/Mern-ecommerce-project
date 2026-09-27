import axios from "axios";

// ==========================================
// Global Axios Authentication Interceptor
// ==========================================

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ==========================================
// Global Axios Response Interceptor
// ==========================================

axios.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      console.warn("Authentication required or token expired.");
    }

    return Promise.reject(error);
  },
);

export default axios;
