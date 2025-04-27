import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (sessionId: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://phuctv.local:9999');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected:', socket.id);
      socket.emit('join-session', sessionId);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  return socketRef;
};
