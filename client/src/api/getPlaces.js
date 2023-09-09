import { instance } from "../config/axios.config"

const API_URL = import.meta.env.VITE_GEOCODING_URL

export default async function getPlaces(data) {
    try {
        const response = await instance.get(`${API_URL}/search?q=${data}&format=json`)
        if (response.status === 200) {
            return response
        }
    } catch (error) {
        throw error
    }
}


