import { Server } from 'socket.io';
import { gameEventHandler } from './socketIOEventHandlers/gameEventHandler.js';
import { userEventsHandler } from './socketIOEventHandlers/userEventsHandler.js';
import jwt from 'jsonwebtoken'
import createError from './utils/createError.js';

let io
let users = new Map()

export const initializeSocketIO = (server) => {
    io = new Server(server)

    io.use(async (socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            try {
                const decoded = jwt.verify(socket.handshake.query.token, process.env.JWT_ACCESS_TOKEN_SECRET)
                socket.user = decoded
                next()
            } catch (err) {
                console.log(err)
                next(createError("JsonWebTokenError", "Invalid Token", err))
            }
        } else {
            next(createError("JsonWebTokenError", "Token Not Provided"))
        }
    }).on('connection', (socket) => {
        userEventsHandler(socket, users)
        gameEventHandler(socket, users)
    })
}

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!')
    }
    return io
}
