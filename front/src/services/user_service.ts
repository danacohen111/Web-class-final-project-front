import apiClient from "./api-client";
import CanceledError from "./api-client"; 
export { CanceledError };

export interface User {
    _id?: string;
    email: string;
    password: string;
    avatar?: string;
}

export const register = (user: User) => {
    const abortController = new AbortController();
    const request = apiClient.post<User>('/auth/register', user, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

export const login = async (user: User) => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.post('/auth/login', user, { signal: abortController.signal });
        const { accessToken, refreshToken, _id } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', _id);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const uploadImage = (img: File) => {
    const formData = new FormData();
    formData.append("file", img);
    
    const request = apiClient.post('/file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return { request };
};

export default { register, login, uploadImage };
