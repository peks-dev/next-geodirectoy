'use client';

export default function ProfileBannerSkeleton() {
  return (
    <div className="gap-md flex items-center">
      {/* Avatar skeleton */}
      <div className="relative">
        <div className="h-12 w-12 animate-pulse rounded-full bg-gradient-to-r from-[var(--color-light-secondary)]/20 via-[var(--color-light-tertiary)]/20 to-[var(--color-light-secondary)]/20 bg-[length:200%_100%]" />
        {/* Holographic ring */}
        <div className="absolute -inset-1 animate-pulse rounded-full border border-[var(--color-border)]/30 bg-gradient-to-r from-[var(--color-light-secondary)]/10 via-[var(--color-light-tertiary)]/10 to-[var(--color-light-secondary)]/10 bg-[length:200%_100%] [animation-delay:0.3s]" />
      </div>

      {/* Name skeleton */}
      <div className="h-6 w-32 animate-pulse rounded bg-gradient-to-r from-[var(--color-light-secondary)]/20 via-[var(--color-light-tertiary)]/20 to-[var(--color-light-secondary)]/20 bg-[length:200%_100%]" />
    </div>
  );
}
