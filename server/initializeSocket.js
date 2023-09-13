import { Server } from 'socket.io'
import jwt from 'jsonwebtoken';
import { handleConnection } from './socketIOEventHandlers/connectionHandler.js';

let io;

export const initializeSocketIO = (server) => {
    io = new Server(server);

    io.use(async (socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            try {
                jwt.verify(socket.handshake.query.token, process.env.JWT_ACCESS_TOKEN_SECRET, function (err, decoded) {
                    if (err) return next(new Error('Authentication error'));
                    socket.decoded = decoded;
                    next();
                });
            } catch (err) {
                next(new Error('Authentication error'));
            }
        }
        else {
            next(new Error('Authentication error'));
        }
    }).on('connection', handleConnection);
}

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}
