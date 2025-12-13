'use client';

export default function ReviewsSectionSkeleton() {
  return (
    <div className="gap-md flex grow flex-col overflow-auto pb-4">
      {/* Reviews List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-20 w-full animate-pulse rounded-lg bg-gradient-to-r from-[var(--color-light-secondary)]/20 via-[var(--color-light-tertiary)]/20 to-[var(--color-light-secondary)]/20 bg-[length:200%_100%]"
          />
        ))}
      </div>
    </div>
  );
}
