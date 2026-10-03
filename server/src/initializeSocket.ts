import { Server as HttpServer } from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Server as IOServer, Socket as IOSocket } from 'socket.io';
import { corsOrigin } from './config/cors.config';
import { createSocketThrottle } from './config/security.config';
import { gameEventHandler } from './socketIOEventHandlers/gameEventHandler';
import { userEventsHandler } from './socketIOEventHandlers/userEventsHandler';
import CustomError from './utils/createError';

export interface AuthenticatedSocket extends IOSocket {
  // Both come from the verified access token, never from data sent by the client.
  userId?: string;
  username?: string;
}

export interface OnlineUser {
  socketId: string;
  username: string;
  friendsList: string[];
}

let io: IOServer;
const users = new Map<string, OnlineUser>();

export const initializeSocketIO = (server: HttpServer) => {
  io = new IOServer(server, {
    cors: { origin: corsOrigin, credentials: true },
    maxHttpBufferSize: 100_000, // no event needs more than a few KB
  });

  io.use((socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    const token = socket.handshake.query?.token;
    if (!token) return next(new CustomError('JsonWebTokenError', 'Token Not Provided'));
    try {
      const decoded = jwt.verify(token as string, process.env.JWT_ACCESS_TOKEN_SECRET as string) as JwtPayload;
      socket.userId = decoded.id;
      socket.username = decoded.username;
      next();
    } catch (err) {
      next(new CustomError('JsonWebTokenError', 'Invalid Token', err as Error));
    }
  }).on('connection', (socket: AuthenticatedSocket) => {
    // Drop events from a socket that floods the server; events expecting a reply get an error so the
    // client isn't left waiting.
    const allow = createSocketThrottle();
    socket.use((packet, next) => {
      if (allow()) return next();
      const ack = packet[packet.length - 1];
      if (typeof ack === 'function') ack({ ok: false, error: 'Too many requests. Slow down a little.' });
    });
    userEventsHandler(socket, users);
    gameEventHandler(socket);
  });
};

export const getIO = (): IOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
