'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './swiper-overrides.css';

export interface SlideItem {
  id: string | number;
  component: React.ReactNode;
  icon: React.ReactNode;
  label?: string;
}

interface DinamicSliderProps {
  slides: SlideItem[];
  initialSlide?: number;
  autoHeight?: boolean;
  className?: string;
}

export default function DinamicSlider({
  slides,
  initialSlide = 0,
  autoHeight = false,
  className = '',
}: DinamicSliderProps) {
  const [activeIndex, setActiveIndex] = useState(initialSlide);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // Manejar cambio de slide
  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  // Manejar click en icono de navegación
  const handleIconClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  // Si no hay slides, mostrar mensaje
  if (!slides || slides.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg bg-[var(--color-dark-tertiary)]">
        <p className="text-gray-400">No hay contenido disponible</p>
      </div>
    );
  }

  return (
    <div
      className={`dinamic-slider-container gap-md flex w-full grow flex-col ${className}`}
    >
      {/* Sección 1: Área del componente */}
      <div className="dinamic-slider-content relative grow overflow-hidden">
        <Swiper
          modules={[Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          onSwiper={setSwiperInstance}
          onSlideChange={handleSlideChange}
          initialSlide={initialSlide}
          autoHeight={autoHeight}
          pagination={false}
          className="h-full w-full cursor-ew-resize"
          noSwiping={true} // Habilitar la funcionalidad
          noSwipingClass="swiper-no-swiping" // Clase a buscar
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="flex h-full w-full items-center justify-center p-4">
                {slide.component}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Sección 2: Controles de navegación con iconos */}
      <nav className="dinamic-slider-navigation bg-dark-primary mx-4 mb-4 flex flex-shrink-0 items-center justify-center">
        <ul className="flex w-full justify-around">
          {slides.map((slide, index) => (
            <li
              key={slide.id}
              className={`dinamic-slider-nav-icon text-accent-primary border-t-2 border-solid border-transparent transition-all duration-200 ease-in ${
                activeIndex === index ? 'active' : ''
              }`}
            >
              <button
                onClick={() => handleIconClick(index)}
                className={`my-4 h-[2.3rem] w-[2.3rem] cursor-pointer transition-all duration-200 ease-in`}
                aria-label={slide.label || `Ir al slide ${index + 1}`}
                title={slide.label}
              >
                {slide.icon}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .dinamic-slider-nav-icon:hover {
          filter: drop-shadow(0 0 3px currentColor);
        }

        .dinamic-slider-nav-icon.active {
          color: var(--color-accent-primary);
          filter: drop-shadow(0 0 3px currentColor);
          border-color: var(--color-accent-primary);
        }
      `}</style>
    </div>
  );
}
