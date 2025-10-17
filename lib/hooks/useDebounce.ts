import { useState, useEffect } from 'react';

/**
 * Hook que retrasa la actualización de un valor (debounce).
 * @param value - El valor a "debouncear".
 * @param delay - El tiempo de espera en milisegundos.
 * @returns El valor después del tiempo de espera.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Iniciar un temporizador para actualizar el valor debounced
    // después de que el 'delay' haya pasado.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el temporizador si el valor cambia (por ejemplo, el usuario sigue escribiendo/moviendo)
    // o si el componente se desmonta.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se re-ejecuta si el valor o el delay cambian

  return debouncedValue;
}
