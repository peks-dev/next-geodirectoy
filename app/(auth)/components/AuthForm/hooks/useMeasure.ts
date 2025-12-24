import { useState, useRef, useEffect } from 'react';

export const useMeasure = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry.borderBoxSize) {
        const borderBoxSize = entry.borderBoxSize[0];
        setHeight(borderBoxSize.blockSize);
      } else {
        setHeight(entry.contentRect.height);
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, height] as const;
};
