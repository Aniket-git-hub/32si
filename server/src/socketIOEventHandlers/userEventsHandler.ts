import { getIO } from "../initializeSocket"
import { Server, Socket } from 'socket.io';

interface User {
    socketId: string;
    friendsList: string[];
}

export const userEventsHandler = (socket: Socket, users: Map<string, User>) => {
    const io: Server = getIO()

    const addUser = (socketId: string, userId: string) => {
        users.set(userId, { socketId: socketId, friendsList: [] })
    }
    const removeUser = (userId: string) => {
        users.delete(userId)
    }

    socket.on('userConnected', (userId: string, friendsList: string[]) => {
        socket.userId = userId
        addUser(socket.id, userId)
        const user = users.get(userId)
        if (user) {
            user.friendsList = friendsList
            let onlineFriends = friendsList.filter(friendId => users.has(friendId))
            socket.emit('friendsOnline', onlineFriends)
            onlineFriends.forEach(friendId => {
                const friend = users.get(friendId);
                if (friend) {
                    io.to(friend.socketId).emit('friendConnected', userId)
                }
            })
        }
    })

    socket.on('disconnect', () => {
        const userId = socket.userId
        if (users.has(userId)) {
            const user = users.get(userId)
            if (user) {
                user.friendsList.forEach(friendId => {
                    const friend = users.get(friendId);
                    if (friend) {
                        io.to(friend.socketId).emit('friendDisconnected', userId)
                    }
                });
                removeUser(userId)
            }
        }
    })

    socket.on('connectionRequest', ({ userTo, ...rest }) => {
        if (users.has(userTo._id)) {
            const user = users.get(userTo._id)
            if (user) {
                io.to(user.socketId).emit("connectionRequest", { userTo, ...rest })
            }
        }
    })

    socket.on("connectionRequestAccepted", ({ userTo, ...rest }) => {
        if (users.has(userTo._id)) {
            const user = users.get(userTo._id);
            if (user) {
                io.to(user.socketId).emit("connectionRequestAccepted", { userTo, ...rest });
            }
        }
    })

}
