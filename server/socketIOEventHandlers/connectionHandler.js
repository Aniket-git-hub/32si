export const handleConnection = (socket) => {
    console.log('Hello! ' + socket.decoded.name);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

}