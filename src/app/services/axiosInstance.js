import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // URL base de la API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token en cada solicitud
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
