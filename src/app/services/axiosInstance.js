import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://3.137.192.224:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  console.log('token: ', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Headers de la solicitud:', config.headers); // Para verificar los headers
  return config;
});

export default axiosInstance;
