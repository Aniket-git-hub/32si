import { interceptorsInstance } from "../config/axios.config";

const handleRequest = async (endpoint, data, method) => {
    try {
        let response;
        const accessToken = localStorage.getItem('accessToken');
        const token = `Bearer ${accessToken}`
        const config = {
            headers: {
                Authorization: token,
            },
            withCredentials: true
        };
        switch (method) {
            case "GET":
                response = await interceptorsInstance.get(endpoint, config);
                break;
            case "POST":
                response = await interceptorsInstance.post(endpoint, data, config);
                break;
            case "PUT":
                response = await interceptorsInstance.put(endpoint, data, config);
                break;
            case "DELETE":
                response = await interceptorsInstance.delete(endpoint, config);
                break;
            default:
                throw new Error("Invalid method");
        }
        if (response.status === 200) {
            return response;
        }
    } catch (error) {
        throw error
    }
}

const env = import.meta.env.VITE_ENV

const updateUserEndpoint = env === 'production' ? import.meta.env.VITE_UPDATE_USER_ENDPOINT : '/user/'
export const updateUser = async (data) => handleRequest(updateUserEndpoint, data, "PUT")