import axios, { CanceledError } from "axios";

export { CanceledError }
const apiClient = axios.create({
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
});

export default apiClient;