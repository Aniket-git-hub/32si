import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { getEndpoint } from '../utils/Helper';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const { accessToken, user } = useAuth()

    useEffect(() => {
        if (user != null) {
            const newSocket = io(getEndpoint("VITE_SOCKET_BASE_URL", "http://localhost:3000/"), {
                query: { token: accessToken },
                transports: ['websocket', 'polling', 'flashsocket']
            });

            newSocket.on("connect", () => {
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
    }, [user])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
