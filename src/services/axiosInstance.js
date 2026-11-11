import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = 
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Terjadi kesalahan saat menghubungi API'

        return Promise.reject(new Error(message))
    }
)

export default axiosInstance;