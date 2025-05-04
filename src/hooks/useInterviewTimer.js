
import { useState, useEffect, useRef } from 'react';

const useInterviewTimer = (initialTime, isActive, onTimeExpired) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onTimeExpired && onTimeExpired();
            return initialTime;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, initialTime, onTimeExpired]);

  // Reset timer function
  const resetTimer = () => {
    setTimeLeft(initialTime);
  };

  return { timeLeft, resetTimer };
};

export default useInterviewTimer;
