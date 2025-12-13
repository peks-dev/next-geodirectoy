'use client';

export default function ImageSliderSkeleton() {
  return (
    <div className="h-[20rem] w-full md:h-[35rem]">
      <div className="h-full w-full animate-pulse rounded-lg bg-gradient-to-r from-[var(--color-light-secondary)]/20 via-[var(--color-light-tertiary)]/20 to-[var(--color-light-secondary)]/20 bg-[length:200%_100%]" />
    </div>
  );
}
