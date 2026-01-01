'use client';

export default function MapSkeleton() {
  return (
    <div
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

      {/* Centro - Indicador de carga con efecto de pulsación */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Punto central con efecto de pulsación */}
          <div
            className="h-4 w-4 animate-pulse rounded-full"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              boxShadow: '0 0 20px var(--color-accent-primary)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
