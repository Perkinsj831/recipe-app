import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const getNewToken = async (refreshToken) => {
  const response = await axios.post(`${apiUrl}/api/auth/refresh-token`, { token: refreshToken });
  return response.data.token;
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return null;
  }

  try {
    const newToken = await getNewToken(refreshToken);
    localStorage.setItem('token', newToken);
    return newToken;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    return null;
  }
};

const isTokenExpired = (token) => {
  const decoded = jwtDecode(token);
  return decoded.exp * 1000 < Date.now();
};

const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(async (config) => {
    let token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      token = await refreshToken();
    }
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use((response) => {
    return response;
  }, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = await refreshToken();
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axios(originalRequest);
      }
    }
    
    return Promise.reject(error);
  });
};

export default setupAxiosInterceptors;