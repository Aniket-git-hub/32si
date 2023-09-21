import { getIO } from "../initializeSocket"
import { Server, Socket } from 'socket.io';

interface User {
    _id: string;
    [key: string]: any;
}

export const gameEventHandler = (socket: Socket, users: Map<string, User>) => {
    const io: Server = getIO()

    socket.on("newChallenge", ({ userTo, ...rest }: { userTo: User; rest: any; }) => {
        if (users.has(userTo._id)) {
            const user = users.get(userTo._id)
            if (user) {
                io.to(user.socketId).emit("newChallenge", {
                    userTo,
                    ...rest,
                })
            }
        }
    })

    socket.on("challengeAccepted", ({ userTo, ...rest }: { userTo: User; rest: any; }) => {
        if (users.has(userTo._id)) {
            const user = users.get(userTo._id)
            if (user) {
                io.to(user.socketId).emit("challengeAccepted", {
                    userTo,
                    ...rest,
                })
            }
        }
    })
}
