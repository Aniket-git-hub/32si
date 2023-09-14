import { getIO } from "../initializeSocket.js"
import { devPrint } from "../utils/Helper.js"

export const userEventsHandler = (socket, users) => {
    const io = getIO()

    const addUser = (socketId, userId) => {
        users.set(userId, { socketId: socketId, friendsList: [] })
    }
    const removeUser = (userId) => {
        users.delete(userId)
    }

    socket.on('userConnected', (userId, friendsList) => {
        socket.userId = userId
        users.get(userId).friendsList = friendsList
        let onlineFriends = friendsList.filter(friendId => users.has(friendId))
        socket.emit('friendsOnline', onlineFriends)
        onlineFriends.forEach(friendId => {
            io.to(users.get(friendId).socketId).emit('friendConnected', userId)
        })
    })

    socket.on('disconnect', () => {
        const userId = socket.userId
        if (users.has(userId)) {
            users.get(userId).friendsList.forEach(friendId => {
                if (users.has(friendId)) {
                    io.to(users.get(friendId).socketId).emit('friendDisconnected', userId)
                }
            });
            removeUser(userId)
        }
    })
}
