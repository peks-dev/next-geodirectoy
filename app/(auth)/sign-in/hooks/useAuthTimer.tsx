import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useAuthTimer = (initialTime: number = 600) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, []);

  const startTimer = (onExpire?: () => void) => {
    if (timerId.current) clearInterval(timerId.current);

    timerId.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerId.current) clearInterval(timerId.current);
          toast.warning('El código de verificación ha expirado.');
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = (time: number = initialTime) => {
    if (timerId.current) clearInterval(timerId.current);
    setTimeLeft(time);
  };

  const clearTimer = () => {
    if (timerId.current) clearInterval(timerId.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    startTimer,
    resetTimer,
    clearTimer,
    formatTime,
  };
};
