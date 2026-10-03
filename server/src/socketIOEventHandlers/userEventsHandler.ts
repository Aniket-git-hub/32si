import { isValidObjectId } from 'mongoose';
import { Server } from 'socket.io';
import MESSAGE, { MAX_MESSAGE_LENGTH } from '../models/message';
import USER from '../models/user';
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

  /**
   * chat:send { to, text } -> ack { ok, message } | { ok: false, error }
   * Messages are saved, so friends who are offline get them later. Every tab of both people
   * receives 'chat:message'.
   */
  socket.on('chat:send', async (payload: { to?: unknown; text?: unknown } = {}, ack?: unknown) => {
    const reply = typeof ack === 'function' ? ack : () => undefined;
    const from = socket.userId;
    const to = String(payload?.to ?? '');
    const text = typeof payload?.text === 'string' ? payload.text.trim() : '';
    if (!from || !isValidObjectId(to)) return reply({ ok: false, error: 'Unknown player.' });
    if (!text) return reply({ ok: false, error: 'Message is empty.' });
    if (text.length > MAX_MESSAGE_LENGTH)
      return reply({ ok: false, error: `Messages can be at most ${MAX_MESSAGE_LENGTH} characters.` });
    try {
      const allies = await USER.exists({ _id: from, friends: to });
      if (!allies) return reply({ ok: false, error: 'You can only message your allies.' });
      const message = (await MESSAGE.create({ from, to, text })).toObject();
      io.to(`user:${to}`).to(`user:${from}`).emit('chat:message', message);
      reply({ ok: true, message });
    } catch (error) {
      console.error('[chat] could not send message', error);
      reply({ ok: false, error: 'Could not send the message.' });
    }
  });

  /** chat:read { from } - the user has seen the conversation with `from`. */
  socket.on('chat:read', async (payload: { from?: unknown } = {}) => {
    const from = String(payload?.from ?? '');
    if (!socket.userId || !isValidObjectId(from)) return;
    try {
      await MESSAGE.updateMany({ from, to: socket.userId, readAt: null }, { $set: { readAt: new Date() } });
    } catch (error) {
      console.error('[chat] could not mark messages read', error);
    }
  });
};
