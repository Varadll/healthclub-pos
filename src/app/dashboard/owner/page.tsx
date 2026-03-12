'use client';

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import StatsCard from '@/components/dashboard/stats-card';
import ClubSummaryCard from '@/components/dashboard/club-summary-card';
import { StatsCardSkeleton, ClubCardSkeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalClubs: number;
  totalStaff: number;
  totalCustomers: number;
  activeMemberships: number;
}

interface Club {
  id: string;
  name: string;
  address: string;
  logoUrl: string | null;
  trainerCount: number;
  customerCount: number;
  activeMembershipCount: number;
}

export default function OwnerDashboard() {
  const { user, loading: userLoading } = useCurrentUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, clubsRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/clubs'),
        ]);
        const statsData = await statsRes.json();
        const clubsData = await clubsRes.json();
        setStats(statsData);
        setClubs(clubsData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-heading font-semibold text-white leading-tight">
          {greeting()}{!userLoading && user ? `, ${user.fullName}` : ''}
        </h1>
        <p className="text-[14px] text-white/40 mt-1 font-body">
          Here&apos;s an overview of all your clubs
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : stats ? (
          <>
            <StatsCard
              label="Total Clubs"
              value={stats.totalClubs}
              icon="◆"
              subtitle="Across all locations"
            />
            <StatsCard
              label="Staff"
              value={stats.totalStaff}
              icon="◈"
              subtitle="Managers & trainers"
            />
            <StatsCard
              label="Customers"
              value={stats.totalCustomers}
              icon="◇"
              subtitle="All clubs combined"
            />
            <StatsCard
              label="Active Plans"
              value={stats.activeMemberships}
              icon="♦"
              subtitle="Current memberships"
            />
          </>
        ) : null}
      </div>

      {/* Clubs Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-heading font-semibold text-white">
            Your Clubs
          </h2>
          <span className="text-[12px] text-white/30 font-body">
            {clubs.length} location{clubs.length !== 1 ? 's' : ''}
          </span>
        </div>

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
    </div>
  );
}
