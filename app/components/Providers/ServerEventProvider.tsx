import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ServerContextProps {
  shouldRefetchServers: boolean;
  shakeServerIcons: () => void;
  shouldRefetchServer: boolean;
  shakeServer: () => void;
}

const ServerContext = createContext<ServerContextProps | undefined>(undefined);

interface ServerProviderProps {
  children: ReactNode;
}

export const ServerEventProvider: React.FC<ServerProviderProps> = ({ children }) => {
    const [shouldRefetchServers, setShouldRefetchServers] = useState(false);
    const [shouldRefetchServer, setShouldRefetchServer] = useState(false)

    const shakeServer = () => setShouldRefetchServer((prev)=>!prev)
    const shakeServerIcons = () => setShouldRefetchServers((prev) => !prev);

  return (
    <ServerContext.Provider 
      value={{ 
        shouldRefetchServers, 
        shakeServerIcons, 
        shouldRefetchServer, 
        shakeServer 
        }}
      >
      {children}
    </ServerContext.Provider>
  );
};

export const useServerContext = (): ServerContextProps => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServerContext must be used within a ServerProvider');
  }
  return context;
};
