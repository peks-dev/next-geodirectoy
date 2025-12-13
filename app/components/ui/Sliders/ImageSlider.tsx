'use client';
import { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './swiper-overrides.css';
import ImageSliderSkeleton from '../skeletons/ImageSliderSkeleton';

interface ImageSliderProps {
  images: string[];
  altTexts?: string[];
  enableNavigation?: boolean;
  enablePagination?: boolean;
  enableAutoplay?: boolean;
  autoplayDelay?: number;
  isLoading?: boolean;
}

export default function ImageSlider({
  images,
  altTexts,
  enableNavigation = false,
  enablePagination = false,
  enableAutoplay = false,
  autoplayDelay = 4000,
  isLoading = false,
}: ImageSliderProps) {
  // Memoizar módulos
  const modules = useMemo(() => {
    const mods = [];
    if (enableNavigation) mods.push(Navigation);
    if (enablePagination) mods.push(Pagination);
    if (enableAutoplay) mods.push(Autoplay);
    return mods;
  }, [enableNavigation, enablePagination, enableAutoplay]);

  // Memoizar configuración de autoplay
  const autoplayConfig = useMemo(
    () =>
      enableAutoplay
        ? {
            delay: autoplayDelay,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }
        : false,
    [enableAutoplay, autoplayDelay]
  );

  if (isLoading) {
    return <ImageSliderSkeleton />;
  }

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
        navigation={enableNavigation}
        pagination={enablePagination ? { clickable: true } : false}
        autoplay={autoplayConfig}
        loop={images.length > 1}
        className="h-full w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <div className="relative h-full w-full">
              <Image
                src={image}
                alt={altTexts?.[index] || `Imagen ${index + 1} del slider`}
                fill
                className="bg-border object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
