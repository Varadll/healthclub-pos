export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-surface-sunken rounded-md ${className}`}
    />
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-surface-raised border border-border rounded-md p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-11 h-11" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function ClubCardSkeleton() {
  return (
    <div className="bg-surface-raised border border-border rounded-md p-6">
      <div className="flex items-center gap-4 mb-5">
        <Skeleton className="w-12 h-12" />
        <div className="flex-1">
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="gold-divider mb-4" />
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Skeleton className="h-7 w-8 mb-1" />
          <Skeleton className="h-3 w-14" />
        </div>
        <div>
          <Skeleton className="h-7 w-8 mb-1" />
          <Skeleton className="h-3 w-14" />
        </div>
        <div>
          <Skeleton className="h-7 w-8 mb-1" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}
