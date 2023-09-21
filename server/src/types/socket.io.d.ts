declare module "socket.io" {
      interface Socket {
            userId: string,
            handshake: {
                  query: {
                        token: string;
                  };
            };
      }
}
