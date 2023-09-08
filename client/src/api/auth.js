import  instance  from "../config/axios.config"

const handleRequest = async (url, data) => {
    try {
        const response = await instance.post(url, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        if (response.status === 200 || response.status === 201) {
            return response
        } 
    } catch (error) {
        throw error
    }
}

const env = import.meta.env.VITE_ENV

const loginUserEndpoint = env === 'production' ? import.meta.env.VITE_LOGIN_USER_ROUTE : '/auth/login'
export const loginUser = async (credentials) => handleRequest(loginUserEndpoint, credentials)

const registerUserEndpoint = env === 'production' ? import.meta.env.VITE_REGISTER_USER_ROUTE : '/auth/register'
export const registerUser = async (details) => handleRequest(registerUserEndpoint, details)

const forgotPasswordEndpoint = env === 'production' ? import.meta.env.VITE_FORGOT_PASSWORD_ROUTE : '/auth/forgot-password'
export const forgotPassword = async (credentials) => handleRequest(forgotPasswordEndpoint, credentials)

const verifyOtpEndpoint = env === 'production' ? import.meta.env.VITE_VERIFY_OTP_ROUTE : '/auth/forgot-password/verify-otp'
export const verifyOtp = async (credentials) => handleRequest(verifyOtpEndpoint, credentials)

const resetPasswordEndpoint = env === 'production' ? import.meta.env.VITE_RESET_PASSWORD_ROUTE : '/auth/reset-password'
export const resetPassword = async (credentials) => handleRequest(resetPasswordEndpoint, credentials)

