import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.xchangesv.es',
  headers: {
    'Content-Type': 'application/json',
  },
  // http://3.137.192.224:8080
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
