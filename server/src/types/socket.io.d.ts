import { Socket as IOSocket } from "socket.io";

declare module "socket.io" {
      interface Socket extends IOSocket {
            userId: string;
      }
}
