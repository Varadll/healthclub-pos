'use client';

import Link from 'next/link';

interface CustomerCardProps {
  id: string;
  fullName: string;
  phone: string | null;
  gender: string | null;
  goal: string | null;
  membershipStatus: 'active' | 'expired' | 'none';
  daysRemaining: number | null;
  lastWeight: number | null;
  weightChange: number | null;
  startingWeight: number | null;
}

export default function CustomerCard({
  id,
  fullName,
  phone,
  gender,
  goal,
  membershipStatus,
  daysRemaining,
  lastWeight,
  weightChange,
  startingWeight,
}: CustomerCardProps) {
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const statusConfig = {
    active: {
      label: `${daysRemaining} days left`,
      bg: 'bg-success-bg',
      text: 'text-success',
      dot: 'bg-success',
    },
    expired: {
      label: 'Expired',
      bg: 'bg-danger-bg',
      text: 'text-danger',
      dot: 'bg-danger',
    },
    none: {
      label: 'No membership',
      bg: 'bg-surface-sunken',
      text: 'text-charcoal/50',
      dot: 'bg-charcoal/30',
    },
  };

  const status = statusConfig[membershipStatus];

  return (
    <Link
      href={`/dashboard/trainer/customers/${id}`}
      className="
        block rounded-2xl border border-border bg-surface-raised p-5
        transition-all duration-200
        hover:shadow-md hover:border-gold/30 hover:-translate-y-0.5
        active:translate-y-0
      "
    >
      {/* Top row: avatar + name + status */}
      <div className="flex items-center gap-4 mb-4">
        {/* Initials avatar */}
        <div className="w-12 h-12 rounded-xl bg-charcoal flex items-center justify-center flex-shrink-0">
          <span className="text-[15px] font-display font-semibold text-gold/80">
            {initials}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-body font-medium text-charcoal truncate">
            {fullName}
          </h3>
          {phone && (
            <p className="text-[12px] text-charcoal/45 mt-0.5">{phone}</p>
          )}
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          <span className={`text-[11px] font-medium ${status.text}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Bottom row: stats */}
      <div className="grid grid-cols-3 gap-3">
        {/* Goal */}
        <div className="rounded-xl bg-surface-sunken px-3 py-2.5">
          <p className="text-[10px] text-charcoal/40 uppercase tracking-wider mb-0.5">Goal</p>
          <p className="text-[13px] font-medium text-charcoal/70 truncate">
            {goal || '—'}
          </p>
        </div>

        {/* Current Weight */}
        <div className="rounded-xl bg-surface-sunken px-3 py-2.5">
          <p className="text-[10px] text-charcoal/40 uppercase tracking-wider mb-0.5">Weight</p>
          <p className="text-[13px] font-medium text-charcoal/70">
            {lastWeight ? `${lastWeight} kg` : startingWeight ? `${startingWeight} kg` : '—'}
          </p>
        </div>

        {/* Weight Change */}
        <div className="rounded-xl bg-surface-sunken px-3 py-2.5">
          <p className="text-[10px] text-charcoal/40 uppercase tracking-wider mb-0.5">Change</p>
          {weightChange !== null ? (
            <p className={`text-[13px] font-medium ${weightChange <= 0 ? 'text-success' : 'text-danger'}`}>
              {weightChange <= 0 ? '↓' : '↑'} {Math.abs(weightChange).toFixed(1)} kg
            </p>
          ) : (
            <p className="text-[13px] font-medium text-charcoal/70">—</p>
          )}
        </div>
      </div>
    </Link>
  );
}
