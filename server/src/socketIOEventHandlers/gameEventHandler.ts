import { Socket as IOSocket, Server } from 'socket.io';
import { getIO } from '../initializeSocket';

interface User {
  socketId: string;
  friendsList: string[];
}
interface Socket extends IOSocket {
  userId?: string;
}

const rooms = new Map<string, number>();

export const gameEventHandler = (socket: Socket, users: Map<string, User>) => {
  const io: Server = getIO();

  socket.on('createGame', ({ userId, gameLobbyId }) => {
    const user = users.get(userId)
    if (user) {
      const room = rooms.get(gameLobbyId)
      if (room && room >= 2) {
        console.log('Room is full');
        return;
      }
      socket.join(gameLobbyId);
      console.log(`${userId} join the lobby ${gameLobbyId}`)
      rooms.set(gameLobbyId, (rooms.get(gameLobbyId) || 0) + 1);
      io.to(user.socketId).emit('gameCreated', { gameLobbyId });
    }
  });

  socket.on('joinGame', ({ userId, gameLobbyId }) => {
    const user = users.get(userId);
    if (user) {
      const room = rooms.get(gameLobbyId);
      if (room && room > 2) {
        console.log('Room is full');
        return;
      }
      socket.join(gameLobbyId)
      console.log(`${userId} join the lobby ${gameLobbyId}`)
      rooms.set(gameLobbyId, (rooms.get(gameLobbyId) || 0) + 1);
      io.to(user.socketId).emit('gameJoined', { gameLobbyId });
      socket.to(gameLobbyId).emit('userJoined', { userId });
    }
  });

  socket.on('leaveGame', ({ userId, gameLobbyId }) => {
    const user = users.get(userId);
    if (user) {
      socket.leave(gameLobbyId);
      console.log(`${userId} left the lobby ${gameLobbyId}`);
      rooms.set(gameLobbyId, (rooms.get(gameLobbyId) || 0) - 1);
      io.to(user.socketId).emit('gameLeft', { gameLobbyId });
      socket.to(gameLobbyId).emit('userLeft', { userId });
    }
  });

  socket.on('gameChange', ({ userId, gameLobbyId, ...other }) => {
    const user = users.get(userId);
    if (user) {
      console.log(`${userId} made a change in the game in lobby ${gameLobbyId} ${other} `);
      // io.to(gameLobbyId).emit('gameChanged', { userId, ...other });
      socket.to(gameLobbyId).emit('gameChanged', { userId, ...other })
    }
  });

};