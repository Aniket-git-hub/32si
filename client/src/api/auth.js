import  instance  from "../config/axios.config"

const handleRequest = async (url, data) => {
    try {
        const response = await instance.post(url, data)
        if (response.status === 200 || response.status === 201) {
            return response.data
        } else {
            throw new Error(`Request failed with  status code ${response.status}`)        
        }

    } catch (error) {
        console.log(`Error: ${error.message}`)
        throw error
    }
}

export const loginUser = async (credentials) => handleRequest('/auth/login', credentials)

export const registerUser = async (details) => handleRequest('auth/register', details)
