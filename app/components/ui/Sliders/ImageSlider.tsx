'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './swiper-overrides.css';

interface ImageSliderProps {
  images: string[];
  enableNavigation?: boolean;
  enablePagination?: boolean;
  enableAutoplay?: boolean;
}

export default function ImageSlider({
  images,
  enableNavigation = false,
  enablePagination = false,
  enableAutoplay = false,
}: ImageSliderProps) {
  // Construir módulos dinámicamente
  const modules = [];
  if (enableNavigation) modules.push(Navigation);
  if (enablePagination) modules.push(Pagination);
  if (enableAutoplay) modules.push(Autoplay);

  // Si no hay imágenes, mostrar un placeholder
  if (!images || images.length === 0) {
    return (
      <div
        className="bg-border-dark flex w-full items-center justify-center"
        style={{ height: 'clamp(18rem, 27vh, 25rem)' }}
      >
        <p className="text-gray-400">Sin imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-[20rem] w-full md:h-[35rem]">
      <Swiper
        modules={modules}
        spaceBetween={0}
        slidesPerView={1}
        navigation={enableNavigation || undefined}
        pagination={enablePagination ? { clickable: true } : undefined}
        autoplay={
          enableAutoplay
            ? {
                delay: 4000,
                disableOnInteraction: false,
              }
            : undefined
        }
        loop={images.length > 1}
        className="h-full w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <Image
                src={image}
                alt={`Imagen ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 500px) 100vw, 500px"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
