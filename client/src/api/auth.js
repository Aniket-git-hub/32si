import { instance } from "../config/axios.config"
import { getEndpoint } from "../utils/Helper"

const handleRequest = async (url, data) => {
    try {
        const response = await instance.post(url, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        if ([200, 201].includes(response.status)) {
            return response
        }
    } catch (error) {
        throw error
    }
}


export const loginUser = async (credentials) => handleRequest(getEndpoint('VITE_LOGIN_USER_ROUTE', '/auth/login'), credentials)
export const logoutUser = async () => handleRequest(getEndpoint('VITE_LOGOUT_USER_ROUTE', '/auth/logout'), {})
export const registerUser = async (details) => handleRequest(getEndpoint('VITE_REGISTER_USER_ROUTE', '/auth/register'), details)
export const forgotPassword = async (credentials) => handleRequest(getEndpoint('VITE_FORGOT_PASSWORD_ROUTE', '/auth/forgot-password'), credentials)
export const verifyOtp = async (credentials) => handleRequest(getEndpoint('VITE_VERIFY_OTP_ROUTE', '/auth/forgot-password/verify-otp'), credentials)
export const resetPassword = async (credentials) => handleRequest(getEndpoint('VITE_RESET_PASSWORD_ROUTE', '/auth/reset-password'), credentials)
export const refreshToken = async () => handleRequest(getEndpoint('VITE_REFRESH_TOKEN_ROUTE', '/auth/token/refresh'), {})