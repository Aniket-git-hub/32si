import axios from 'axios'
import { refreshToken } from '../api/auth'

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:3000/'

export const instance = axios.create({
    baseURL: API_URL, 
})

export const interceptorsInstance = axios.create({
    baseURL: API_URL,
})

const responseInterceptor = interceptorsInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const config = error.config
        if (error.response && error.response.status === 401 && !config._retry) {
            try {
                const response = await refreshToken()
                localStorage.setItem("accessToken", response?.data?.accessToken)
                config.headers['Authorization'] = `Bearer ${response?.data?.accessToken}`
                config._retry = true
                return instance(config)
            } catch (error) {
                localStorage.removeItem("accessToken")
                localStorage.removeItem("user")
                localStorage.removeItem("isAuthenticated")
            }
        }
        return Promise.reject(error)
    },
)

// const requestInterceptor = interceptorsInstance.interceptors.request.use()

export const removeInterceptors = () => {
    interceptorsInstance.interceptors.response.eject(responseInterceptor)
    interceptorsInstance.interceptors.request.eject(responseInterceptor)
}