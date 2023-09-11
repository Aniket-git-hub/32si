import { interceptorsInstance } from "../config/axios.config";

const handleRequest = async (endpoint, data, method) => {
    try {
        let response;
        const token = `Bearer ${localStorage.getItem('accessToken')}`
        const config = {
            headers: {
                Authorization: token,
            },
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
export const getAUser = async (username) => handleRequest(`${getEndpoint("VITE_GET_A_USER_ROUTE,", '/user/a/')}${username}`, null, "GET")
export const connectUser = async (userId) => handleRequest(`${getEndpoint("VITE_CONNECT_USER_ROUTE,", '/user/')}${userId}/connect`, null, "POST")
export const disconnectUser = async (userId) => handleRequest(`${getEndpoint("VITE_DISCONNECT_USER_ROUTE,", '/user/')}${userId}/disconnect`, null, "DELETE")
export const acceptConnection = async (userId) => handleRequest(`${getEndpoint("VITE_ACCEPT_CONNECTION_ROUTE,", '/user/')}${userId}/accept`, null, "POST")