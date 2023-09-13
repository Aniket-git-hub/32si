import { instance } from "../config/axios.config"
import { getEndpoint } from "../utils/Helper"

export default async function getPlaces(data) {
    try {
        const response = await instance.get(`${getEndpoint('VITE_GET_PLACES_ROUTE', '/places/city/')}${data}`)
        if (response.status === 200) {
            return response
        }
    } catch (error) {
        throw error
    }
}


