// SocketProvider.jsx
import React, { ReactNode, createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';


interface SocketProviderProps {
    children: ReactNode;
  }
  
const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }:SocketProviderProps) => {
 
  const socket = io('http://localhost:4000', { transports: ['websocket'] });
  console.log("SOCKET RUN")
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
};