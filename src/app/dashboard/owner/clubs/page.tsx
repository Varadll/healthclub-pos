'use client';

import { useEffect, useState } from 'react';
import ClubSummaryCard from '@/components/dashboard/club-summary-card';
import { ClubCardSkeleton } from '@/components/ui/skeleton';

interface Club {
  id: string;
  name: string;
  address: string;
  logoUrl: string | null;
  trainerCount: number;
  customerCount: number;
  activeMembershipCount: number;
}

export default function AllClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClubs() {
      try {
        const res = await fetch('/api/clubs');
        const data = await res.json();
        setClubs(data);
      } catch (err) {
        console.error('Failed to fetch clubs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-heading font-semibold text-white">
          All Clubs
        </h1>
        <p className="text-[14px] text-white/40 mt-1 font-body">
          {clubs.length} location{clubs.length !== 1 ? 's' : ''} across Cork
        </p>
      </div>

      {/* Club Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <>
            <ClubCardSkeleton />
            <ClubCardSkeleton />
            <ClubCardSkeleton />
            <ClubCardSkeleton />
            <ClubCardSkeleton />
          </>
        ) : (
          clubs.map((club) => (
            <ClubSummaryCard
              key={club.id}
              id={club.id}
              name={club.name}
              address={club.address}
              logoUrl={club.logoUrl}
              trainerCount={club.trainerCount}
              customerCount={club.customerCount}
              activeMembershipCount={club.activeMembershipCount}
            />
          ))
        )}
      </div>
    </div>
  );
}
