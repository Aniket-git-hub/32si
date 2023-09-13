import { createContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [data, setData] = useState(null)
    const socketRef = useRef()
    const { accessToken } = useAuth()

    useEffect(() => {
        if (data?.user) {
            console.log(accessToken)
            socketRef.current = io("http://localhost:3000/", {
                query: { token: accessToken },
                transports: ['websocket', 'polling', 'flashsocket'] 
            })

            socketRef.current.on("connect", () => {
                console.log("connected to socket")
            })

            socketRef.current.on("disconnect", () => {
                console.log("disconnected from socket")
            })
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [data])

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, setData }}>
            {children}
        </SocketContext.Provider>
    )
}
