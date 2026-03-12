'use client';

interface MembershipStatusBadgeProps {
  status: 'active' | 'expired' | 'none';
  daysRemaining: number | null;
  type?: '10-day' | '30-day' | null;
}

export default function MembershipStatusBadge({
  status,
  daysRemaining,
  type,
}: MembershipStatusBadgeProps) {
  if (status === 'none' || !daysRemaining) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-sunken">
        <div className="w-2 h-2 rounded-full bg-charcoal/30" />
        <span className="text-[13px] font-body font-medium text-charcoal/50">
          No membership
        </span>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger-bg border border-danger/20">
        <div className="w-2 h-2 rounded-full bg-danger" />
        <span className="text-[13px] font-body font-medium text-danger">
          Expired
        </span>
      </div>
    );
  }

  // Active — color depends on days remaining
  let colorClass = 'text-gold';
  let bgClass = 'bg-gold-muted border-gold/20';
  let dotClass = 'bg-gold';

  if (daysRemaining <= 1) {
    colorClass = 'text-danger';
    bgClass = 'bg-danger-bg border-danger/20';
    dotClass = 'bg-danger animate-pulse';
  } else if (daysRemaining <= 3) {
    colorClass = 'text-warning';
    bgClass = 'bg-warning-bg border-warning/20';
    dotClass = 'bg-warning';
  }

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${bgClass}`}>
      <div className={`w-2 h-2 rounded-full ${dotClass}`} />
      <span className={`text-[13px] font-body font-medium ${colorClass}`}>
        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
      </span>
      {type && (
        <span className="text-[11px] font-body text-charcoal/30 ml-1">
          ({type})
        </span>
      )}
    </div>
  );
}
