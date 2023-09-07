import instance from "../config/axios.config"

const handleRequest = async (endpoint, data, method) => {
    try {
        let response;
        switch (method) {
            case "GET":
                response = await instance.get(endpoint);
                break;
            case "POST":
                response = await instance.post(endpoint, data);
                break;
            case "PUT":
                response = await instance.put(endpoint, data);
                break;
            case "DELETE":
                response = await instance.delete(endpoint);
                break;
            default:
                throw new Error("Invalid method");
        }
        if (response.status === 200 || response.status === 201) {
            return response;
        }
    } catch (error) {
        throw error
    }
}

const env = import.meta.env.VITE_ENV

const updateUserEndpoint = env === 'production' ? import.meta.env.VITE_UPDATE_USER_ENDPOINT : '/user/'
export const updateUser = async (data) => handleRequest(updateUserEndpoint, data, "PUT")

// const getUserEndpoint = env === "production" ? import.meta.env.VITE_GET_USER_ENDPOINT : "/user/";
// export const getUser = async (id) => handleRequest(getUserEndpoint + id, null, "GET");

// const getAllUsersEndpoint = env === "production" ? import.meta.env.VITE_GET_ALL_USERS_ENDPOINT : "/users/";
// export const getAllUsers = async () => handleRequest(getAllUsersEndpoint, null, "GET");

// const deleteUserEndpoint = env === "production" ? import.meta.env.VITE_DELETE_USER_ENDPOINT : "/user/";
// export const deleteUser = async (id) => handleRequest(deleteUserEndpoint + id, null, "DELETE");
