'use client';

import MembershipStatusBadge from '@/components/memberships/membership-status-badge';

interface ProfileHeaderProps {
  fullName: string;
  clubName: string | null;
  clubLogoUrl: string | null;
  joinDate: string;
  startingWeight: number | null;
  membershipStatus: 'active' | 'expired' | 'none';
  daysRemaining: number | null;
  membershipType: '10-day' | '30-day' | null;
}

export default function ProfileHeader({
  fullName,
  clubName,
  clubLogoUrl,
  joinDate,
  startingWeight,
  membershipStatus,
  daysRemaining,
  membershipType,
}: ProfileHeaderProps) {
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-sm mb-6">
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="w-[72px] h-[72px] rounded-2xl bg-charcoal flex items-center justify-center flex-shrink-0">
          <span className="text-[24px] font-display font-semibold text-gold/80">
            {initials}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-[28px] font-display font-semibold text-charcoal leading-tight mb-2">
            {fullName}
          </h1>

          <MembershipStatusBadge
            status={membershipStatus}
            daysRemaining={daysRemaining}
            type={membershipType}
          />

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4">
            {/* Club */}
            <div className="flex items-center gap-2">
              {clubLogoUrl ? (
                <img
                  src={clubLogoUrl}
                  alt=""
                  className="w-5 h-5 rounded object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded bg-charcoal/10 flex items-center justify-center">
                  <span className="text-[8px] font-display font-semibold text-charcoal/40">
                    {clubName?.split(' ').map(w => w[0]).join('').slice(0, 2) || '?'}
                  </span>
                </div>
              )}
              <span className="text-[13px] font-body text-charcoal/50">
                {clubName || 'Unknown club'}
              </span>
            </div>

            {/* Divider */}
            <span className="text-charcoal/15">·</span>

            {/* Join date */}
            <span className="text-[13px] font-body text-charcoal/50">
              Joined {formatDate(joinDate)}
            </span>

            {/* Starting weight */}
            {startingWeight && (
              <>
                <span className="text-charcoal/15">·</span>
                <span className="text-[13px] font-body text-charcoal/50">
                  Start: {startingWeight} kg
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
