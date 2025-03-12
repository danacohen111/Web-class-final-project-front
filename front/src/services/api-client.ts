import axios, { CanceledError } from "axios";
import { BASE_URL } from "../config.ts";

export { CanceledError }
const apiClient = axios.create({
    baseURL: BASE_URL,
});

export default apiClient;