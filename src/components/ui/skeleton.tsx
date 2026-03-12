export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/[0.04] ${className}`}
    />
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-charcoal/40 p-6">
      <Skeleton className="h-4 w-20 mb-4" />
      <Skeleton className="h-9 w-16 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function ClubCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-charcoal/40 p-6">
      <div className="flex items-center gap-4 mb-5">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  );
}

/* ─── Light-theme skeletons (trainer pages) ──────────────── */

export function LightSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-charcoal/[0.05] ${className}`}
    />
  );
}

export function CustomerCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-5">
      <div className="flex items-center gap-4 mb-4">
        <LightSkeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1">
          <LightSkeleton className="h-5 w-36 mb-2" />
          <LightSkeleton className="h-3 w-24" />
        </div>
        <LightSkeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <LightSkeleton className="h-14 rounded-xl" />
        <LightSkeleton className="h-14 rounded-xl" />
        <LightSkeleton className="h-14 rounded-xl" />
      </div>
    </div>
  );
}

export function TrainerStatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-5 shadow-sm">
      <LightSkeleton className="h-4 w-20 mb-3" />
      <LightSkeleton className="h-8 w-14 mb-1" />
      <LightSkeleton className="h-3 w-28" />
    </div>
  );
}

/* ─── Profile page skeletons (Batch 5) ───────────────────── */

export function ProfileHeaderSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-sm mb-6">
      <div className="flex items-start gap-5">
        <LightSkeleton className="w-[72px] h-[72px] rounded-2xl" />
        <div className="flex-1">
          <LightSkeleton className="h-8 w-48 mb-3" />
          <LightSkeleton className="h-7 w-32 rounded-full mb-4" />
          <div className="flex gap-4">
            <LightSkeleton className="h-4 w-28" />
            <LightSkeleton className="h-4 w-36" />
            <LightSkeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MembershipFormSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
      <LightSkeleton className="h-6 w-40 mb-2" />
      <LightSkeleton className="h-4 w-56 mb-5" />
      <div className="grid grid-cols-2 gap-3 mb-5">
        <LightSkeleton className="h-28 rounded-xl" />
        <LightSkeleton className="h-28 rounded-xl" />
      </div>
      <LightSkeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
