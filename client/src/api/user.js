import { interceptorsInstance } from "../config/axios.config";
import { getEndpoint } from "../utils/Helper";

const handleRequest = async (endpoint, data, method, signal) => {
    try {
        let response;
        const token = `Bearer ${localStorage.getItem('accessToken')}`
        const config = {
            headers: {
                Authorization: token,
            },
            signal,
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


export const updateUser = async (data, signal) => handleRequest(getEndpoint('VITE_UPDATE_USER_ROUTE', '/user/'), data, "PUT", signal)
export const getAllUsers = async (data, signal) => handleRequest(getEndpoint('VITE_ALL_USERS_ROUTE', '/user/users'), data, "GET", signal)
export const getAUserByUsername = async (username, signal) => handleRequest(`${getEndpoint("VITE_GET_A_USER_ROUTE", '/user/by-username/')}${username}`, null, "GET", signal)
export const getAUserById = async (id, signal) => handleRequest(`${getEndpoint("VITE_GET_A_USER_ROUTE", '/user/by-id/')}${id}`, null, "GET", signal)
export const connectUser = async (username, signal) => handleRequest(`${getEndpoint("VITE_CONNECT_USER_ROUTE", '/user/')}${username}/connect`, null, "POST", signal)
export const disconnectUser = async (userId, signal) => handleRequest(`${getEndpoint("VITE_DISCONNECT_USER_ROUTE", '/user/')}${userId}/disconnect`, null, "DELETE", signal)
export const acceptConnection = async (userId, signal) => handleRequest(`${getEndpoint("VITE_ACCEPT_CONNECTION_ROUTE", '/user/')}${userId}/accept`, null, "POST", signal)
