import axios from 'axios';
import { config } from '../config';

const requestInterceptor = async (config: any) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `JWT ${accessToken}`;
  }
  return config;
};

const responseInterceptor = async (response: any) => {
  return response;
};

const errorInterceptor = async (error: any) => {
  const originalRequest = error.config;
  if ((error.response.status === 401 || (error.response.status === 400 && error.response.data === 'Access denied')) && !originalRequest._retry) {
    originalRequest._retry = true;
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await axios.post(config.BASE_URL, {
          refreshToken,
        });
        console.log("refreshedddd")
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        originalRequest.headers['Authorization'] = `JWT ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        throw error 
      }
    }
  }
  return Promise.reject(error);
};

export default {
  requestInterceptor,
  responseInterceptor,
  errorInterceptor,
};