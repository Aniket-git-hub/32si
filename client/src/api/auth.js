import instance from "../config/axios.config"

export const loginUser = async (credentials) => {
    try {
        const response = await instance.post('/auth/login', credentials)
        return response.data
    } catch (error) {
        throw error
    }
}

export const registerUser = async (details) => {
    try {
        const response = await instance.post('/auth/register', details)
        return response.data
    } catch (error) {
        throw error
    }
}

