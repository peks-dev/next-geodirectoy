import { useState, useEffect } from 'react';

export const useMatrixEffect = (text: string) => {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    const maxLength = Math.max(display.length, text.length);
    let frame = 0;
    const totalFrames = 20;

    const interval = setInterval(() => {
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(interval);
        return;
      }

      let newText = '';
      for (let i = 0; i < maxLength; i++) {
        if (i < text.length) {
          const progress = frame / totalFrames;
          const revealThreshold = i / maxLength;
          if (progress > revealThreshold) {
            newText += text[i];
          } else {
            newText += chars[Math.floor(Math.random() * chars.length)];
          }
        }
      }
      setDisplay(newText);
      frame++;
    }, 30);

    return () => clearInterval(interval);
  }, [text, display.length]);

  return display;
};
