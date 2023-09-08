import axios from 'axios'

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:3000/'

const instance = axios.create({
    baseURL: API_URL, 
  
})

instance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const config = error.config
        if (error.response && error.response.status === 401 && !config._retry) {
            try {
                const res = await instance.get("/auth/token/refresh", {
                    withCredentials: true,
                    headers: {
                        "Content-Type":"application/json"
                    }
                })
                config._retry = true
                localStorage.setItem("accessToken", res?.data?.accessToken)
                console.log(res)
                config.headers['Authorization'] = `Bearer ${res?.data?.accessToken}`
                return instance(config)
            } catch (error) {
                Promise.reject(error)
            }
            return instance(config)
        }
        return Promise.reject(error)
    },
)



export default instance