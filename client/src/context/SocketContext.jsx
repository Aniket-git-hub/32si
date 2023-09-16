import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { getEndpoint } from '../utils/Helper';
import { refreshToken } from '../api/auth';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const { accessToken, setAccessToken, user } = useAuth()

    useEffect(() => {
        if (user != null) {
            const newSocket = io(getEndpoint("VITE_SOCKET_BASE_URL", "http://localhost:3000/"), {
                query: { token: accessToken },
                transports: ['websocket', 'polling', 'flashsocket']
            });

            let retries = 0;
            const maxRetries = 10;
            newSocket.on("connect_error", async (error) => {
                if (error.message == "Invalid Token" && retries < maxRetries) {
                    try {
                        const response = await refreshToken()
                        localStorage.setItem("accessToken", response.data.accessToken)
                        setAccessToken(response.data.accessToken)
                        retries++;
                        setTimeout(() => {
                            newSocket.io.opts.query = { token: response.data.accessToken }
                            newSocket.connect();
                        }, 5000)
                    } catch (error) {
                        console.log(error)
                    }
                }
            })

            newSocket.on("connect", () => {
                retries = 0;
                console.log("connected");
            });

            newSocket.on("disconnect", () => {
                console.log("disconnected");
            });

            setSocket(newSocket)

            return () => {
                newSocket.disconnect()
            }
        }
    }, [user?._id])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
