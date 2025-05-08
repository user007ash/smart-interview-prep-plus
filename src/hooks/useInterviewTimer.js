
import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing timer in interview questions
 * @param {number} initialTime - Initial time in seconds
 * @param {boolean} isActive - Whether the timer should be active
 * @param {Function} onTimeExpired - Callback to execute when timer expires
 * @param {number} currentQuestionIndex - Current question index for timer reset
 * @returns {Object} Timer state and control functions
 */
const useInterviewTimer = (initialTime, isActive, onTimeExpired, currentQuestionIndex) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);
  
  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime, currentQuestionIndex]);

  useEffect(() => {
    if (isActive) {
      // Clear any existing timer
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Reset timer to initial time when starting a new question
      setTimeLeft(initialTime);
      
      // Start the timer
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
    } else {
      // Clear timer when not active
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, initialTime, onTimeExpired, currentQuestionIndex]);

  // Reset timer function
  const resetTimer = () => {
    setTimeLeft(initialTime);
  };

  // Pause timer function
  const pauseTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Resume timer function
  const resumeTimer = () => {
    if (!isActive) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
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
  };

  return { 
    timeLeft, 
    resetTimer,
    pauseTimer,
    resumeTimer
  };
};

export default useInterviewTimer;
