import  instance  from "../config/axios.config"

const handleRequest = async (url, data) => {
    try {
        const response = await instance.post(url, data)
        if (response.status === 200 || response.status === 201) {
            return response.data
        } 
    } catch (error) {
        throw error
    }
}

export const loginUser = async (credentials) => handleRequest('/auth/login', credentials)

export const registerUser = async (details) => handleRequest('/auth/register', details)

export const forgotPassword = async (credentials) => handleRequest('/auth/forgot-password', credentials)

export const verifyOtp = async (credentials) => handleRequest('/auth/forgot-password/verify-otp', credentials)

export const resetPassword = async (credentials) => handleRequest('/auth/reset-password', credentials)

