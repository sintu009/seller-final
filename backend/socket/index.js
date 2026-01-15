import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://seller-final-2.onrender.com",
      ],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Admin disconnected:', socket.id);
    });
  });
};
