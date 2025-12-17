'use client';

export default function PanelLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="grow"></div>

      {/* Modal skeleton */}
      <div className="transparent-container relative mt-auto h-[94vh] w-[100vw] grow-0 overflow-hidden py-2 shadow-2xl">
        {/* Barra de cerrar */}
        <div className="flex justify-center">
          <div className="bg-background-accent h-2 w-40 animate-pulse rounded-full"></div>
        </div>

        {/* Contenido skeleton */}
        <div className="h-full overflow-y-auto p-4">
          <div className="gap-lg flex h-full w-full flex-col lg:flex-row">
            {/* Skeleton Header */}
            <div className="w-full space-y-4 lg:w-1/3">
              {/* Título skeleton */}
              <div className="bg-background-secondary h-8 w-3/4 animate-pulse rounded"></div>
              {/* Imagen skeleton */}
              <div className="bg-background-secondary aspect-video animate-pulse rounded-lg"></div>
              {/* Descripción skeleton */}
              <div className="space-y-2">
                <div className="bg-background-secondary h-4 animate-pulse rounded"></div>
                <div className="bg-background-secondary h-4 w-5/6 animate-pulse rounded"></div>
                <div className="bg-background-secondary h-4 w-4/6 animate-pulse rounded"></div>
              </div>
            </div>

            {/* Skeleton Content */}
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
