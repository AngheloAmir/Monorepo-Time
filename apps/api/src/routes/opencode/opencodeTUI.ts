import { Server, Socket } from "socket.io";

export default function OpenCodeTUISocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        
        socket.on('opencode:start', (data: any) => {
            console.log(data);
        });
    });
}
