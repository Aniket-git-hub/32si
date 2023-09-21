import { Server, Socket } from "socket.io";
import { gameEventHandler } from "./socketIOEventHandlers/gameEventHandler.js";
import { userEventsHandler } from "./socketIOEventHandlers/userEventsHandler.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import CustomError from "./utils/createError.js";

let io: Server;
let users = new Map<string, any>();

export const initializeSocketIO = (server: any) => {
    io = new Server(server);

    io.use(async (socket: Socket, next: (err?: any) => void) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            try {
                const decoded = jwt.verify(socket.handshake.query.token as string, process.env.JWT_ACCESS_TOKEN_SECRET as string) as JwtPayload;
                socket.userId = decoded.id;
                next();
            } catch (err) {
                console.log(err);
                next(new CustomError("JsonWebTokenError", "Invalid Token", err as Error));
            }
        } else {
            next(new CustomError("JsonWebTokenError", "Token Not Provided"));
        }
    }).on("connection", (socket: Socket) => {
        userEventsHandler(socket, users);
        gameEventHandler(socket, users);
    });
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
