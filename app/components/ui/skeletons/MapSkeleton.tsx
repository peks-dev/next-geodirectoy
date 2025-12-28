'use client';
import { useEffect, useRef } from 'react';
import { animate } from 'motion/react';
import CornerIcon from '@/app/components/ui/svgs/CornerIcon';

export default function MapSkeleton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const centerRingRef = useRef<HTMLDivElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controls: Array<{ stop: () => void }> = [];

    // Animación de la línea de escaneo vertical
    if (scanLineRef.current) {
      const scanLineAnimation = animate(
        scanLineRef.current,
        { y: ['-100%', '100vh'] },
        {
          duration: 3,
          ease: 'linear',
          repeat: Infinity,
          delay: 0.5,
        }
      );
      controls.push(scanLineAnimation);
    }

    // Anillo central - rotación suave
    if (centerRingRef.current) {
      const centerRingAnimation = animate(
        centerRingRef.current,
        { rotate: [0, 360] },
        {
          duration: 8,
          ease: 'linear',
          repeat: Infinity,
        }
      );
      controls.push(centerRingAnimation);
    }

    // Anillo de pulso - escala y opacidad
    if (pulseRingRef.current) {
      const pulseRingAnimation = animate(
        pulseRingRef.current,
        {
          scale: [1, 1.5],
          opacity: [0.6, 0],
        },
        {
          duration: 2,
          ease: [0.25, 0.1, 0.25, 1],
          repeat: Infinity,
        }
      );
      controls.push(pulseRingAnimation);
    }

    return () => {
      // Detener todas las animaciones al desmontar
      controls.forEach((control) => control.stop());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ minHeight: '100%', minWidth: '100%' }}
    >
      {/* Overlay semi-transparente */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'var(--color-dark-secondary)',
          opacity: 0.7,
        }}
      />

      {/* Línea de escaneo vertical */}
      <div
        ref={scanLineRef}
        className="absolute right-0 left-0 h-0.5 -translate-y-full"
        style={{
          background: `linear-gradient(90deg,
            transparent 0%,
            var(--color-accent-primary) 50%,
            transparent 100%)`,
          boxShadow: '0 0 20px var(--color-accent-primary)',
          opacity: 0.8,
        }}
      />

      {/* 4 Marcadores de esquina usando CornerIcon */}
      <CornerIcon position="top-left" size="large" variant="static" />
      <CornerIcon position="top-right" size="large" variant="static" />
      <CornerIcon position="bottom-left" size="large" variant="static" />
      <CornerIcon position="bottom-right" size="large" variant="static" />

      {/* Centro - Indicador de carga */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Anillo de pulso */}
          <div
            ref={pulseRingRef}
            className="absolute -inset-8 rounded-full border-2"
            style={{
              borderColor: 'var(--color-accent-primary)',
              opacity: 0.6,
            }}
          />

          {/* Anillo giratorio */}
          <div
            ref={centerRingRef}
            className="relative h-24 w-24 rounded-full border-2"
            style={{
              borderColor: 'var(--color-accent-primary)',
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
            }}
          />

          {/* Punto central */}
          <div
            className="absolute inset-0 m-auto h-3 w-3 rounded-full"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              boxShadow: '0 0 20px var(--color-accent-primary)',
            }}
          />

          {/* Texto de carga */}
          <div
            className="heading absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
            style={{
              color: 'var(--color-accent-primary)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.2em',
            }}
          >
            INITIALIZING MAP
          </div>
        </div>
      </div>
    </div>
  );
}
