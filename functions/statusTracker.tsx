import { useEffect, FC } from 'react';

interface MouseInactivityDetectorProps {
  onInactive?: () => void;
  onActive?: () => void
}

const MouseInactivityDetector: FC<MouseInactivityDetectorProps> = ({ onInactive, onActive }) => {
  const inactivityThreshold =  3000; // 5 mins
  let inactivityTimer: NodeJS.Timeout

  const resetInactivityTimer = () => {
    if(onActive){
        onActive()
    }
    clearTimeout(inactivityTimer)
    inactivityTimer = setTimeout(() => {
      if (onInactive) {
        onInactive()
      }
    }, inactivityThreshold)
  };

  useEffect(() => {
    const handleMouseMove = () => {
      resetInactivityTimer()
    };

    const handleMouseDown = () => {
      resetInactivityTimer()
    };

    const handleKeyPress = () => {
      resetInactivityTimer()
    };

    //Attach event listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keypress', handleKeyPress)

    //Start the initial timer
    resetInactivityTimer();

    //Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keypress', handleKeyPress)
      clearTimeout(inactivityTimer)
    };
  }, [])

  return null
};

export default MouseInactivityDetector;
