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


export const createAGame = async (data, signal) => handleRequest(getEndpoint('VITE_CREATE_GAME_ROUTE', '/game/create-game'), data, "POST", signal)
// export const getAllUsers = async (data, signal) => handleRequest(`${getEndpoint('VITE_GET_A_GAME', '/user/users')}?page=${data.page}&limit=${data.limit}`, data, "GET", signal)
