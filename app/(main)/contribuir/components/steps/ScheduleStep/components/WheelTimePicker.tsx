import React, { useState, useEffect, useRef, useCallback } from 'react';

// Interfaz para las props
interface TimePickerWheelProps {
  onTimeChange?: (time: string) => void;
  initialTime?: string;
}

// Helper para obtener clientY en eventos mouse/touch
const getClientY = (
  e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
) => {
  return 'touches' in e ? e.touches[0].clientY : e.clientY;
};

// Simulamos GSAP con funciones optimizadas para la demo, con tipos
const gsap = {
  set: (
    element: HTMLElement | HTMLElement[] | null,
    props: Record<string, unknown>
  ) => {
    const elements = Array.isArray(element)
      ? element
      : element
        ? [element]
        : [];
    elements.forEach((el) => {
      if (!el) return;
      let transform = el.style.transform || '';
      Object.keys(props).forEach((key) => {
        if (key === 'y') {
          const val = props[key] as number;
          // Reemplazar o agregar translateY
          transform =
            transform.replace(/translateY\([^)]*\)/, '') +
            ` translateY(${val}px)`;
        } else if (key === 'opacity') {
          el.style.opacity = String(props[key]);
        } else if (key === 'scale') {
          // Reemplazar o agregar scale
          transform =
            transform.replace(/scale\([^)]*\)/, '') + ` scale(${props[key]})`;
        }
      });
      el.style.transform = transform.trim();
    });
  },
  to: (
    element: HTMLElement | null,
    duration: number,
    props: Record<string, unknown>
  ) => {
    if (!element) return;
    const ease =
      (props.ease as string) || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    element.style.transition = `all ${duration}s ${ease}`;
    gsap.set(element, props);
    setTimeout(() => {
      if (element) element.style.transition = '';
    }, duration * 1000);
  },
  timeline: () => ({
    to: (element: HTMLElement | null, props: Record<string, unknown>) => {
      gsap.to(element, (props.duration as number) || 0.3, props);
      return this;
    },
  }),
};

export default function TimePickerWheel({
  onTimeChange,
  initialTime = '12:00',
}: TimePickerWheelProps) {
  const [hours, setHours] = useState<number>(
    parseInt(initialTime.split(':')[0])
  );
  const [minutes, setMinutes] = useState<number>(
    parseInt(initialTime.split(':')[1])
  );
  const [isDragging, setIsDragging] = useState<{
    hours: boolean;
    minutes: boolean;
  }>({
    hours: false,
    minutes: false,
  });
  const [velocity, setVelocity] = useState<{ hours: number; minutes: number }>({
    hours: 0,
    minutes: 0,
  });
  const [lastY, setLastY] = useState<{ hours: number; minutes: number }>({
    hours: 0,
    minutes: 0,
  });
  const [lastTime, setLastTime] = useState<number>(Date.now());

  const hoursRef = useRef<HTMLDivElement | null>(null);
  const minutesRef = useRef<HTMLDivElement | null>(null);
  const hoursValuesRef = useRef<HTMLDivElement | null>(null);
  const minutesValuesRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<{ hours: number | null; minutes: number | null }>(
    { hours: null, minutes: null }
  );

  // Arrays para horas y minutos
  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  // Valor de referencia para suavizado
  const smoothHours = useRef<number>(parseInt(initialTime.split(':')[0]));
  const smoothMinutes = useRef<number>(parseInt(initialTime.split(':')[1]));

  // Notificar cambios al padre
  useEffect(() => {
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onTimeChange?.(formattedTime);
  }, [hours, minutes, onTimeChange]);

  // Función para actualizar posición con animación suave
  const updatePosition = useCallback(
    (type: 'hours' | 'minutes', value: number, animate: boolean = true) => {
      const ref = type === 'hours' ? hoursValuesRef : minutesValuesRef;
      const maxValue = type === 'hours' ? 23 : 59;
      const itemHeight = 48;
      const containerHeight = 200;
      const centerOffset = containerHeight / 2 - itemHeight / 2;

      // Normalizar valor
      const normalizedValue =
        ((value % (maxValue + 1)) + (maxValue + 1)) % (maxValue + 1);
      const targetY = centerOffset - normalizedValue * itemHeight;

      if (ref.current) {
        if (animate && !isDragging[type]) {
          gsap.to(ref.current, 0.6, {
            y: targetY,
            ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          });
        } else {
          gsap.set(ref.current, { y: targetY });
        }
      }

      // Actualizar valores suaves
      if (type === 'hours') {
        smoothHours.current = normalizedValue;
        setHours(normalizedValue);
      } else {
        smoothMinutes.current = normalizedValue;
        setMinutes(normalizedValue);
      }
    },
    [isDragging]
  );

  // Animación de entrada
  useEffect(() => {
    // Animar contenedor principal
    if (hoursRef.current && minutesRef.current) {
      gsap.set([hoursRef.current, minutesRef.current], {
        opacity: 0,
        scale: 0.8,
        y: 30,
      });

      gsap.to(hoursRef.current, 0.8, {
        opacity: 1,
        scale: 1,
        y: 0,
        delay: 0.2,
      });

      gsap.to(minutesRef.current, 0.8, {
        opacity: 1,
        scale: 1,
        y: 0,
        delay: 0.4,
      });
    }

    // Posiciones iniciales
    updatePosition('hours', hours, false);
    updatePosition('minutes', minutes, false);
  }, [hours, minutes, updatePosition]);

  // Manejar inicio de arrastre
  const handleDragStart = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
      type: 'hours' | 'minutes'
    ) => {
      e.preventDefault();
      const clientY = getClientY(e);

      setIsDragging((prev) => ({ ...prev, [type]: true }));
      setLastY((prev) => ({ ...prev, [type]: clientY }));
      setLastTime(Date.now());
      setVelocity((prev) => ({ ...prev, [type]: 0 }));

      // Cancelar animaciones existentes
      if (animationRef.current[type]) {
        clearInterval(animationRef.current[type]);
        animationRef.current[type] = null;
      }

      // Efecto visual de inicio
      const container =
        type === 'hours' ? hoursRef.current : minutesRef.current;
      if (container) {
        gsap.to(container, 0.2, { scale: 1.05 });
      }
    },
    []
  );

  // Manejar movimiento de arrastre
  const handleDragMove = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
      type: 'hours' | 'minutes'
    ) => {
      if (!isDragging[type]) return;

      e.preventDefault();
      const clientY = getClientY(e);
      const deltaY = lastY[type] - clientY;
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime > 0) {
        const currentVelocity = deltaY / deltaTime;
        setVelocity((prev) => ({ ...prev, [type]: currentVelocity }));
      }

      // Sensibilidad y suavizado
      const sensitivity = 0.05;
      const currentValue =
        type === 'hours' ? smoothHours.current : smoothMinutes.current;
      const newValue = currentValue + deltaY * sensitivity;

      updatePosition(type, newValue, false);

      setLastY((prev) => ({ ...prev, [type]: clientY }));
      setLastTime(currentTime);
    },
    [isDragging, lastY, lastTime, updatePosition]
  );

  // Manejar fin de arrastre con inercia
  const handleDragEnd = useCallback(
    (type: 'hours' | 'minutes') => {
      setIsDragging((prev) => ({ ...prev, [type]: false }));

      const container =
        type === 'hours' ? hoursRef.current : minutesRef.current;
      if (container) {
        gsap.to(container, 0.3, { scale: 1 });
      }

      // Aplicar inercia
      const currentVelocity = velocity[type];
      const maxValue = type === 'hours' ? 23 : 59;

      if (Math.abs(currentVelocity) > 0.1) {
        let currentValue =
          type === 'hours' ? smoothHours.current : smoothMinutes.current;
        let vel = currentVelocity * 20; // Factor de inercia
        const friction = 0.85; // Fricción

        const inertiaAnimation = () => {
          if (Math.abs(vel) < 0.1) {
            // Snap al valor más cercano
            const nearestValue = Math.round(currentValue);
            const finalValue =
              ((nearestValue % (maxValue + 1)) + (maxValue + 1)) %
              (maxValue + 1);
            updatePosition(type, finalValue, true);
            return;
          }

          currentValue += vel;
          vel *= friction;

          updatePosition(type, currentValue, false);
          animationRef.current[type] = requestAnimationFrame(inertiaAnimation);
        };

        inertiaAnimation();
      } else {
        // Snap directo al valor más cercano
        const currentValue =
          type === 'hours' ? smoothHours.current : smoothMinutes.current;
        const nearestValue = Math.round(currentValue);
        const finalValue =
          ((nearestValue % (maxValue + 1)) + (maxValue + 1)) % (maxValue + 1);
        updatePosition(type, finalValue, true);
      }
    },
    [velocity, updatePosition]
  );

  // Renderizar columna de rueda
  const renderWheelColumn = (
    type: 'hours' | 'minutes',
    label: string,
    array: number[],
    currentValue: number
  ) => {
    const ref = type === 'hours' ? hoursRef : minutesRef;
    const valuesRef = type === 'hours' ? hoursValuesRef : minutesValuesRef;

    return (
      <div className="flex flex-col items-center">
        <div className="text-xs font-semibold text-slate-500 mb-4 tracking-wider uppercase">
          {label}
        </div>

        <div
          ref={ref}
          className="relative w-20 h-48 overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ height: '200px' }}
          onMouseDown={(e) => handleDragStart(e, type)}
          onMouseMove={(e) => handleDragMove(e, type)}
          onMouseUp={() => handleDragEnd(type)}
          onMouseLeave={() => handleDragEnd(type)}
          onTouchStart={(e) => handleDragStart(e, type)}
          onTouchMove={(e) => handleDragMove(e, type)}
          onTouchEnd={() => handleDragEnd(type)}
        >
          {/* Máscaras de gradiente */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />

          {/* Indicador central */}
          <div className="absolute top-1/2 left-1 right-1 h-12 -translate-y-1/2 z-10 pointer-events-none">
            <div className="h-full bg-gradient-to-r from-violet-100 to-purple-100 border-2 border-violet-300 rounded-xl shadow-lg backdrop-blur-sm" />
          </div>

          {/* Valores */}
          <div
            ref={valuesRef}
            className="absolute left-0 right-0 will-change-transform"
          >
            {/* Renderizar valores extendidos para scroll infinito */}
            {Array.from({ length: array.length * 3 }, (_, i) => {
              const value = array[i % array.length];
              const index = i - array.length;
              const distance = Math.abs(index);
              const opacity = distance <= 2 ? 1 - distance * 0.25 : 0.25;
              const scale = distance <= 1 ? 1 - distance * 0.1 : 0.8;
              const isCenter = Math.abs(value - currentValue) < 0.5;

              return (
                <div
                  key={`${value}-${i}`}
                  className={`h-12 flex items-center justify-center text-2xl font-bold transition-all duration-200 will-change-transform ${
                    isCenter
                      ? 'text-violet-600 drop-shadow-sm'
                      : 'text-slate-600'
                  }`}
                  style={{
                    opacity,
                    transform: `scale(${scale})`,
                    textShadow: isCenter
                      ? '0 2px 4px rgba(139, 69, 193, 0.2)'
                      : 'none',
                  }}
                >
                  {value.toString().padStart(2, '0')}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Time Picker Premium
        </h2>
        <p className="text-slate-500 text-sm">
          Arrastra para seleccionar la hora
        </p>
      </div>

      {/* Wheels Container */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        {renderWheelColumn('hours', 'Horas', hoursArray, hours)}

        {/* Separador animado */}
        <div
          className="flex flex-col items-center justify-center h-48"
          style={{ height: '200px' }}
        >
          <div className="text-4xl font-bold text-violet-500 animate-pulse">
            :
          </div>
        </div>

        {renderWheelColumn('minutes', 'Minutos', minutesArray, minutes)}
      </div>

      {/* Display del tiempo */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl px-6 py-4 shadow-lg">
          <div className="text-3xl font-mono font-bold text-slate-800">
            {hours.toString().padStart(2, '0')}:
            {minutes.toString().padStart(2, '0')}
          </div>
        </div>
        <div className="text-xs text-slate-400 mt-3 font-medium">
          Formato 24 horas
        </div>
      </div>
    </div>
  );
}
