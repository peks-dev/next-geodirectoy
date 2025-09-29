'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface BgLinesProps {
  className?: string;
}

export default function BgLines({ className }: BgLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Contenedor para las líneas del circuito
    const circuitLines = document.createElement('div');
    circuitLines.className = 'absolute inset-0';
    container.innerHTML = '';
    container.appendChild(circuitLines);

    const lines: HTMLDivElement[] = [];
    const horizontalLinesCount = 4;
    const verticalLinesCount = 4;

    // Crear líneas horizontales
    for (let i = 0; i < horizontalLinesCount; i++) {
      const line = document.createElement('div');
      line.className =
        'absolute h-px w-full opacity-0 transition-colors duration-300 ease-in-out';
      line.style.top = `${20 + i * 20}%`;
      line.dataset.delay = String(i * 0.5);
      circuitLines.appendChild(line);
      lines.push(line);
    }

    // Crear líneas verticales
    for (let i = 0; i < verticalLinesCount; i++) {
      const line = document.createElement('div');
      line.className =
        'absolute w-px h-full opacity-0 transition-colors duration-300 ease-in-out line-vertical';
      line.style.left = `${20 + i * 20}%`;
      line.dataset.delay = String(2 + i * 0.5);
      circuitLines.appendChild(line);
      lines.push(line);
    }

    let tweens: gsap.core.Tween[] = [];

    const createAnimation = (isDarkMode: boolean) => {
      // Detener y limpiar animaciones anteriores
      tweens.forEach((tween) => tween.kill());
      tweens = [];

      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
        .trim();
      const accentOpacity = isDarkMode ? 0.15 : 0.25;
      const rgbaColor =
        accentColor === '#de9e36'
          ? `rgba(222, 158, 54, ${accentOpacity})`
          : `rgba(171, 105, 0, ${accentOpacity})`;

      lines.forEach((line) => {
        // Asignar gradiente correcto según la orientación de la línea
        if (line.classList.contains('line-vertical')) {
          line.style.background = `linear-gradient(to bottom, transparent, ${rgbaColor}, transparent)`;
        } else {
          line.style.background = `linear-gradient(to right, transparent, ${rgbaColor}, transparent)`;
        }

        const tween = gsap.to(line, {
          opacity: 1,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: parseFloat(line.dataset.delay || '0'),
        });
        tweens.push(tween);
      });
    };

    let isDarkMode = document.documentElement.classList.contains('dark');
    createAnimation(isDarkMode);

    // Observar cambios en el tema para recrear la animación
    const observer = new MutationObserver(() => {
      const newIsDarkMode = document.documentElement.classList.contains('dark');
      if (isDarkMode !== newIsDarkMode) {
        isDarkMode = newIsDarkMode;
        createAnimation(isDarkMode);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Limpieza al desmontar el componente
    return () => {
      tweens.forEach((tween) => tween.kill());
      observer.disconnect();
    };
  }, []);

  const baseClasses =
    'fixed inset-0 w-full h-full flex flex-col justify-center items-center overflow-hidden z-[1] backdrop-blur-[10px] p-[30px] shadow-[0_4px_6px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_20px_rgba(0,0,0,0.2)]';

  return (
    <div ref={containerRef} className={`${baseClasses} ${className || ''}`} />
  );
}
