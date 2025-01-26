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


export const updateUser = async (data, signal) => handleRequest(getEndpoint('VITE_UPDATE_USER_ROUTE', '/user/'), data, "PUT", signal)
export const getAllUsers = async (data, signal) => handleRequest(`${getEndpoint('VITE_ALL_USERS_ROUTE', '/user/users')}?page=${data.page}&limit=${data.limit}`, data, "GET", signal)
export const getAUserByUsername = async (username, signal) => handleRequest(`${getEndpoint("VITE_GET_USER_BY_USERNAME_ROUTE", '/user/by-username/')}${username}`, null, "GET", signal)
export const getAUserById = async (id, signal) => handleRequest(`${getEndpoint("VITE_GET_USER_BY_ID_ROUTE", '/user/by-id/')}${id}`, null, "GET", signal)
export const connectUser = async (username, signal) => handleRequest(`${getEndpoint("VITE_CONNECT_USER_ROUTE", '/user/')}${username}/connect`, null, "POST", signal)
export const disconnectUser = async (userId, signal) => handleRequest(`${getEndpoint("VITE_DISCONNECT_USER_ROUTE", '/user/')}${userId}/disconnect`, null, "DELETE", signal)
export const acceptConnection = async (userId, signal) => handleRequest(`${getEndpoint("VITE_ACCEPT_CONNECTION_ROUTE", '/user/')}${userId}/accept`, null, "POST", signal)
export const updateProfilePicture = async (formData, signal) => handleRequest(`${getEndpoint("VITE_UPDATE_PROFILE_PICTURE_ROUTE", '/user/upload-profile-picture')}`, formData, "POST", signal)
export const deleteProfilePicture = async (filename, signal) => handleRequest(`${getEndpoint("VITE_DELETE_PROFILE_PICTURE_ROUTE", '/user/delete-profile-picture')}/${filename}`, null, "DELETE", signal)
export const getProfilePicture = (filename) => {
    let url = getEndpoint("VITE_GET_PROFILE_PICTURE_ROUTE", 'http://localhost:3000/user/get-profile-picture')
    return `${url}/${filename}`
}
export const getSmallProfilePicture = (filename) => {
    let url = getEndpoint("VITE_GET_SMALL_PROFILE_PICTURE_ROUTE", 'http://localhost:3000/user/get-profile-picture-small')
    return `${url}/${filename}`
}
export const sendFeedback = async (data, signal) => handleRequest(`${getEndpoint("VITE_SEND_FEEDBACK_URL", '/user/feedback')}`, data, "POST", signal)

export const searchUsers = async (data, signal) => {
    let url = `${getEndpoint("VITE_SEARCH_USERS_ROUTE", '/user/users/search')}?q=${data.query}`;
    if (data.longitude && data.latitude) {
        url += `&longitude=${data.longitude}&latitude=${data.latitude}`;
    }
    url += `&page=${data.page}&limit=${data.limit}`;
    return handleRequest(url, null, "GET", signal);
};

export const deleteAccountRequest = async (signal) => handleRequest(`${getEndpoint("VITE_DELETE_ACCOUNT_ROUTE", '/user/')}`, null, "DELETE", signal)
export const confirmAccountDeletion = async (data, signal) => handleRequest(`${getEndpoint("VITE_CONFIRM_ACCOUNT_DELETION", '/user/delete-user')}/${data.deletionToken}`, data, "POST", signal)
export const cancelAccountDeleteRequest = async (data, signal) => handleRequest(`${getEndpoint("VITE_CANCEL_ACCOUNT_DELETION", '/user/cancel-delete-user')}/${data.deletionToken}`, data, "POST", signal)