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
                response = await interceptorsInstance.get(`${endpoint}?page=${data?.page}&limit=${data?.limit}`, config);
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


const getEndpoint = (productionRoute, developmentRoute) => import.meta.env.VITE_ENV === 'production' ? import.meta.env[productionRoute] : developmentRoute

export const updateUser = async (data) => handleRequest(getEndpoint('VITE_UPDATE_USER_ROUTE', '/user/'), data, "PUT")
export const getAllUsers = async (data) => handleRequest(getEndpoint('VITE_ALL_USERS_ROUTE', '/user/users'), data, "GET")