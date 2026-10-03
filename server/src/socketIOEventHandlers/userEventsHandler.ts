import { Server } from 'socket.io';
import { AuthenticatedSocket as Socket, OnlineUser as User, getIO } from '../initializeSocket';

export const userEventsHandler = (socket: Socket, users: Map<string, User>) => {
  const io: Server = getIO();

  const addUser = (socketId: string, userId: string, username: string) => {
    users.set(userId, { socketId: socketId, friendsList: [], username: username });
  };
  socket.on('userConnected', (_userId: string, friendsList: string[], username: string) => {
    // The user id comes from the verified token (see initializeSocket), not from the client.
    const userId = socket.userId;
    if (!userId || !Array.isArray(friendsList)) return;
    addUser(socket.id, userId, socket.username ?? username);
    const user = users.get(userId);
    if (user) {
      user.friendsList = friendsList;
      const onlineFriends = friendsList.filter((friendId) => users.has(friendId));
      socket.emit('friendsOnline', onlineFriends);
      onlineFriends.forEach((friendId) => {
        const friend = users.get(friendId);
        if (friend) {
          io.to(friend.socketId).emit('friendConnected', userId);
        }
      });
    }
  });

  socket.on('disconnect', () => {
    const userId = socket.userId;
    const user = userId ? users.get(userId) : undefined;
    // Only the socket that registered the user removes it (another tab may have taken over).
    if (!userId || !user || user.socketId !== socket.id) return;
    user.friendsList.forEach((friendId) => {
      const friend = users.get(friendId);
      if (friend) {
        io.to(friend.socketId).emit('friendDisconnected', userId);
      }
    });
    users.delete(userId);
  });

  socket.on('connectionRequest', ({ userTo, ...rest }) => {
    const user = users.get(userTo._id);
    if (user) {
      io.to(user.socketId).emit('connectionRequest', { userTo, ...rest });
    }
  });

  socket.on('connectionRequestAccepted', ({ userTo, ...rest }) => {
    const user = users.get(userTo._id);
    if (user) {
      io.to(user.socketId).emit('connectionRequestAccepted', { userTo, ...rest });
    }
  });

  socket.on('message', ({ userToId, ...rest }) => {
    const user = users.get(userToId);
    if (user) {
      io.to(user.socketId).emit('message', rest);
    }
  });
};
