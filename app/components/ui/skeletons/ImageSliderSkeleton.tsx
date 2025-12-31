'use client';

export default function ImageSliderSkeleton() {
  return (
    <div className="h-80 w-full md:h-140">
      <div className="h-full w-full animate-pulse rounded-lg bg-linear-to-r from-(--color-light-secondary)/20 via-(--color-light-tertiary)/20 to-(--color-light-secondary)/20 bg-size-[200%_100%]" />
    </div>
  );
}
