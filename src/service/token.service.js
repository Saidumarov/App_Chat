import axios from "axios";
const BASE_URI = import.meta.env.VITE_MKBANK_AI_API;
export const api = axios.create({
  baseURL: BASE_URI,
});


api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem('token')
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)