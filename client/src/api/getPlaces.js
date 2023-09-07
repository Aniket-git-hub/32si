import instance from "../config/axios.config"

export default async function getPlaces(data) {
    try {
        const response = await instance.get(`https://nominatim.openstreetmap.org/search?q=${data}&format=json`)
        if (response.status === 200) {
            return response
        }
    } catch (error) {
        throw error
    }
}


