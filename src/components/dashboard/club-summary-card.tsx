import Link from "next/link";

interface ClubSummaryCardProps {
  id: string;
  name: string;
  address: string | null;
  logoUrl: string | null;
  trainerCount: number;
  customerCount: number;
  activeMembershipCount: number;
}

export function ClubSummaryCard({
  id,
  name,
  address,
  logoUrl,
  trainerCount,
  customerCount,
  activeMembershipCount,
}: ClubSummaryCardProps) {
  // Generate initials from club name
  const initials = name
    .split(" ")
    .filter((word) => word.length > 0 && word[0] === word[0].toUpperCase())
    .map((word) => word[0])
    .slice(0, 2)
    .join("");

  return (
    <Link href={`/dashboard/owner/clubs/${id}`}>
      <div className="bg-surface-raised border border-border rounded-md p-6 hover:shadow-md hover:border-gold/30 transition-all duration-200 cursor-pointer group">
        {/* Club header */}
        <div className="flex items-center gap-4 mb-5">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="w-12 h-12 rounded-md object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-md bg-charcoal flex items-center justify-center">
              <span className="font-display text-base text-gold">
                {initials}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl text-charcoal group-hover:text-gold transition-colors duration-200 truncate">
              {name}
            </h3>
            {address && (
              <p className="font-body text-sm text-charcoal/40 truncate">
                {address}
              </p>
            )}
          </div>
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            className="text-charcoal/20 group-hover:text-gold transition-colors duration-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>

        {/* Stats row */}
        <div className="gold-divider mb-4" />
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-display text-2xl text-charcoal stat-number">
              {trainerCount}
            </p>
            <p className="font-body text-xs text-charcoal/40 mt-0.5">
              Trainers
            </p>
          </div>
          <div>
            <p className="font-display text-2xl text-charcoal stat-number">
              {customerCount}
            </p>
            <p className="font-body text-xs text-charcoal/40 mt-0.5">
              Customers
            </p>
          </div>
          <div>
            <p className="font-display text-2xl text-charcoal stat-number">
              {activeMembershipCount}
            </p>
            <p className="font-body text-xs text-charcoal/40 mt-0.5">
              Active
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
