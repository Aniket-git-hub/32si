import { Socket as IOSocket, Server } from 'socket.io';
import { getIO } from '../initializeSocket';

interface User {
  socketId: string;
  username: string,
  friendsList: string[];
}
interface Socket extends IOSocket {
  userId?: string;
}
interface Lobby {
  users: string[];
  count: number;
  creator: string;
}

// Create a new Map to store the online lobbies
const lobbies = new Map<string, { users: string[], count: number, creator: string }>();

export const gameEventHandler = (socket: Socket, users: Map<string, User>) => {
  const io: Server = getIO();

  socket.on('createGame', ({ userId, gameLobbyId }) => {
    const user = users.get(userId);
    if (user) {
      const lobby = lobbies.get(gameLobbyId) || { users: [], count: 0, creator: userId };
      if (lobby.count >= 2) {
        console.log('Room is full');
        return;
      }
      socket.join(gameLobbyId);
      console.log(`${user.username} join the lobby ${gameLobbyId}`);
      (lobby as Lobby).users.push(userId);
      lobby.count++;
      lobbies.set(gameLobbyId, lobby);
      io.to(user.socketId).emit('gameCreated', { gameLobbyId });
    }
  });

  socket.on('joinGame', ({ userId, gameLobbyId }) => {
    const user = users.get(userId);
    if (user) {
      const lobby = lobbies.get(gameLobbyId);
      if (!lobby) {
        console.log('Lobby does not exist');
        io.to(user.socketId).emit('lobbyDoesNotExist', { gameLobbyId });
        return;
      }
      if (lobby.count >= 2 || lobby.users.includes(userId)) {
        console.log('Room is full or user is already in the room');
        io.to(user.socketId).emit('roomFull', { gameLobbyId });
        return;
      }
      const creator = users.get(lobby.creator)
      if (creator) {
        io.to(creator.socketId).emit('requestJoin', { userId, gameLobbyId });
      }

      io.to(user.socketId).emit('requestSubmitted', { gameLobbyId });
    }
  });

  // When the creator gives permission, add the user to the lobby
  socket.on('allowJoin', ({ userId, gameLobbyId }) => {
    const user = users.get(userId);
    const lobby = lobbies.get(gameLobbyId);
    if (user && lobby && lobby.creator === socket.userId) {
      socket.join(gameLobbyId);
      console.log(`${user.username} join the lobby ${gameLobbyId}`);
      lobby.users.push(userId);
      lobby.count++;
      lobbies.set(gameLobbyId, lobby);
      socket.to(gameLobbyId).emit('userJoined', { userId, username: user.username });
      const creator = users.get(lobby.creator)
      if (creator) {
        io.to(creator.socketId).emit('userJoined', { userId, username: user.username });
        io.to(user.socketId).emit('gameJoined', { gameLobbyId, creator: creator.username });
      }
    }
  });

  socket.on('leaveGame', ({ userId, gameLobbyId }) => {
    const user = users.get(userId);
    if (user) {
      const lobby = lobbies.get(gameLobbyId) || { users: [], count: 0, creator: '' };
      const index = lobby.users.indexOf(userId);
      if (index !== -1) {
        socket.leave(gameLobbyId);
        console.log(`${userId} left the lobby ${gameLobbyId}`);
        lobby.users.splice(index, 1);
        lobby.count--;
        if (lobby.count === 0) {
          lobbies.delete(gameLobbyId);
        } else {
          lobbies.set(gameLobbyId, lobby);
        }
        io.to(user.socketId).emit('gameLeft', { gameLobbyId });
        socket.to(gameLobbyId).emit('userLeft', { userId, username: user.username });
      }
    }
  });

  socket.on('gameChange', ({ userId, gameLobbyId, ...other }) => {
    const user = users.get(userId);
    if (user) {
      console.log(`${userId} made a change in the ${gameLobbyId} in lobby ${gameLobbyId} ${other} `);
      // io.to(gameLobbyId).emit('gameChanged', { userId, ...other });
      socket.to(gameLobbyId).emit('gameChanged', { userId, ...other })
    }
  });

};