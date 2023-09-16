import { getIO } from "../initializeSocket.js"

export const gameEventHandler = (socket, users) => {
    const io = getIO()

    socket.on("newChallenge", ({ userTo, ...rest }) => {
        if (users.has(userTo._id)) {
            io.to(users.get(userTo._id).socketId).emit("newChallenge", {
                userTo,
                ...rest,
            })
        }
    })

    socket.on("challengeAccepted", ({ userTo, ...rest }) => {
        if (users.has(userTo._id)) {
            io.to(users.get(userTo._id).socketId).emit("challengeAccepted", {
                userTo,
                ...rest,
            })
        }
    })
}
