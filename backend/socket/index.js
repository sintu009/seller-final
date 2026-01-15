import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
