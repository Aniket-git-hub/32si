export const userEventsHandler = (socket, users) => {

    socket.on('userConnected', (userId, friendsList) => {
        addUser(socket.id, userId)
        users[userId].friendsList = friendsList

        let onlineFriends = friendsList.filter(friendId => users[friendId])
        socket.emit('friendsOnline', onlineFriends)

        onlineFriends.forEach(friendId => {
            io.to(users[friendId].socketId).emit('friendConnected', userId)
        })
    })

    socket.on('disconnect', () => {
        const userId = socket.userId
        if (users[userId]) {
            users[userId].friendsList.forEach(friendId => {
                if (users[friendId]) {
                    io.to(users[friendId].socketId).emit('friendDisconnected', userId)
                }
            });
            delete users[userId]
        }
    })

    
}

function addUser(socketId, userId) {
    users[userId] = { socketId: socketId, friendsList: [] }
}