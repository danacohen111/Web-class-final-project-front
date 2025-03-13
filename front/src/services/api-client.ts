import axios, { CanceledError } from "axios";
import { config } from "../config.ts";

export { CanceledError }
const apiClient = axios.create({
    baseURL: config.BASE_URL,
});

export default apiClient;