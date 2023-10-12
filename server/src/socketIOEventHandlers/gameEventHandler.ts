import { Socket as IOSocket, Server } from 'socket.io';
import { getIO } from '../initializeSocket';
import generateUniqueLobbyId from '../utils/generateUniqueLobbyId';

interface User {
  socketId: string;
  friendsList: string[];
}
interface Socket extends IOSocket {
  userId?: string;
}
// Create a map to keep track of the number of users in each room
const rooms = new Map<string, number>();

export const gameEventHandler = (socket: Socket, users: Map<string, User>) => {
  const io: Server = getIO();

  socket.on('createGame', (userId: string, data) => {
    const user = users.get(userId)
    if (user) {
      const gameRoomId = generateUniqueLobbyId();

      io.to(user.socketId).emit('gameCreated', { gameRoomId });

      // // Check if the room already has two users
      // if (rooms.get(gameRoomId) >= 2) {
      //   console.log('Room is full');
      //   return;
      // }

      // // Join the user to the room
      // socket.join(gameRoomId);

      // // Increment the number of users in the room
      // rooms.set(gameRoomId, (rooms.get(gameRoomId) || 0) + 1);

      // // Emit an event back to the user with the room ID
      // socket.emit('gameCreated', { gameRoomId });
    }
  });
};