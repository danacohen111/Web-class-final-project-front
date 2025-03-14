import axios, { AxiosResponse, CanceledError } from "axios";
import { config } from "../config.ts";
import authMiddleware from "../middleware/authMiddleware";

export { CanceledError }

const apiClient = axios.create({
    baseURL: config.BASE_URL
});

apiClient.interceptors.request.use(authMiddleware.requestInterceptor);
apiClient.interceptors.response.use(authMiddleware.responseInterceptor, authMiddleware.errorInterceptor);

const get = async <T>(url: string, params?: any): Promise<AxiosResponse<T>> => {
  try {
    const response = await axios.get<T>(`${config.BASE_URL}${url}`, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

const post = async <T>(url: string, data: any, config?: any): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiClient.post<T>(url, data, config ? config : {    
        headers: {
        'Content-Type': 'application/json',
    }});
    return response;
  } catch (error) {
    throw error;
  }
};

const put = async <T>(url: string, data: any, config?: any): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiClient.put<T>(url, data, config ? config : {    
        headers: {
        'Content-Type': 'application/json',
    }});
    return response;
  } catch (error) {
    throw error;
  }
};

const del = async <T>(url: string): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiClient.delete<T>(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  get,
  post,
  put,
  delete: del,
};