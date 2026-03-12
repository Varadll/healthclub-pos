import Link from 'next/link';

interface ClubSummaryCardProps {
  id: string;
  name: string;
  address: string;
  logoUrl: string | null;
  trainerCount: number;
  customerCount: number;
  activeMembershipCount: number;
}

function ClubInitials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
      <span className="text-gold font-heading font-semibold text-[15px]">{initials}</span>
    </div>
  );
}

export default function ClubSummaryCard({
  id, name, address, logoUrl, trainerCount, customerCount, activeMembershipCount,
}: ClubSummaryCardProps) {
  return (
    <Link
      href={`/dashboard/owner/clubs/${id}`}
      className="
        block rounded-2xl border border-white/[0.06] bg-charcoal/40 backdrop-blur-sm p-6
        transition-all duration-200
        hover:border-gold/20 hover:shadow-[0_0_30px_-10px_rgba(201,168,76,0.08)]
        hover:-translate-y-0.5
      "
    >
      {/* Club Header */}
      <div className="flex items-center gap-4 mb-5">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="w-12 h-12 rounded-xl object-cover border border-white/[0.06]"
          />
        ) : (
          <ClubInitials name={name} />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-heading font-semibold text-white truncate">
            {name}
          </h3>
          <p className="text-[12px] text-white/35 truncate">{address}</p>
        </div>
        <span className="text-white/20 text-sm">→</span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Trainers', value: trainerCount },
          { label: 'Customers', value: customerCount },
          { label: 'Active', value: activeMembershipCount },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white/[0.03] px-3 py-3 text-center">
            <p className="text-[18px] font-heading font-semibold text-white">{stat.value}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.1em]">{stat.label}</p>
          </div>
        ))}
      </div>
    </Link>
  );
}
