import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

const SOCKET_URL = API_URL;

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Only create socket if one doesn't exist already
    if (socketRef.current) {
      return;
    }

    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('setup', user);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('reconnect', () => {
      setIsConnected(true);
      newSocket.emit('setup', user);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  return { socket, isConnected };
};

