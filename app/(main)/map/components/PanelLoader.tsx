'use client';

import { useState, useRef, useEffect } from 'react';

export default function PanelLoader() {
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.getBoundingClientRect();
      setIsVisible(true);
    }
  }, []);

  const getPanelStyle = () => {
    if (isVisible) {
      return {
        transform: 'translateY(0%)',
        opacity: 1,
        transition:
          'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease-out',
      };
    }
    return {
      transform: 'translateY(100%)',
      opacity: 0,
      transition:
        'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease-out',
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="grow"></div>

      <div
        ref={panelRef}
        className="transparent-container relative mt-auto h-[94dvh] w-screen grow-0 overflow-hidden py-2 shadow-2xl"
        style={getPanelStyle()}
      >
        <div className="flex justify-center">
          <div className="bg-background-accent h-2 w-40 animate-pulse rounded-full"></div>
        </div>

        <div className="h-full overflow-y-auto p-4">
          <div className="gap-lg flex h-full w-full flex-col lg:flex-row">
            <div className="w-full space-y-4 lg:w-1/3">
              <div className="bg-background-secondary h-8 w-3/4 animate-pulse rounded"></div>
              <div className="bg-background-secondary aspect-video animate-pulse rounded-lg"></div>
              <div className="space-y-2">
                <div className="bg-background-secondary h-4 animate-pulse rounded"></div>
                <div className="bg-background-secondary h-4 w-5/6 animate-pulse rounded"></div>
                <div className="bg-background-secondary h-4 w-4/6 animate-pulse rounded"></div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="bg-background-secondary h-6 w-1/2 animate-pulse rounded"></div>
              <div className="space-y-2">
                <div className="bg-background-secondary h-4 animate-pulse rounded"></div>
                <div className="bg-background-secondary h-4 animate-pulse rounded"></div>
                <div className="bg-background-secondary h-4 w-3/4 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
