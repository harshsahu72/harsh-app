import { io } from 'socket.io-client';
import config from '../config';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(config.SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'], // Prefer WebSocket (lower latency for call signaling)
    });
  }
  return socket;
};

export const connectSocket = (userId) => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    // Wait for connection before emitting
    s.once('connect', () => {
      s.emit('user_online', userId);
    });
  } else {
    s.emit('user_online', userId);
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export default getSocket;
