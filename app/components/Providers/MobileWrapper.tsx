// ScreenWidthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ScreenWidthContextProps {
    screenWidth: number;
}
interface ScreenWidthProviderProps {
    children: React.ReactNode;
  }
  
const ScreenWidthContext = createContext<ScreenWidthContextProps | undefined>(undefined);

export const ScreenWidthProvider: React.FC<ScreenWidthProviderProps> = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const contextValue: ScreenWidthContextProps = { screenWidth };

  return (
    <ScreenWidthContext.Provider value={contextValue}>
      {children}
    </ScreenWidthContext.Provider>
  );
};

export const useScreenWidth = (): boolean => {
  const context = useContext(ScreenWidthContext);

  if (!context || context.screenWidth === undefined) {
    throw new Error('useScreenWidth must be used within a ScreenWidthProvider');
  }

  return context.screenWidth <= 430;
};
