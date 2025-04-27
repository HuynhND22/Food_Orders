import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // tùy chỉnh cho bảo mật
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Khi client muốn join theo session/payment/chat
    socket.on('join-session', (sessionId: string) => {
      socket.join(sessionId);
    });

    // Lắng nghe tin nhắn từ client
    socket.on('send-message', ({ to, message }) => {
      console.log(`Gửi message tới phòng ${to}: ${message}`);
      io.to(to).emit('receive-message', { from: socket.id, message });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.IO chưa được khởi tạo');
  return io;
};
