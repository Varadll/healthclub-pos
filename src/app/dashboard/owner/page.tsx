"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ClubSummaryCard } from "@/components/dashboard/club-summary-card";
import { StatsCardSkeleton, ClubCardSkeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalClubs: number;
  totalTrainers: number;
  totalCustomers: number;
  activeMemberships: number;
  expiringSoon: number;
}

interface ClubWithStats {
  id: string;
  name: string;
  address: string | null;
  logo_url: string | null;
  trainer_count: number;
  customer_count: number;
  active_membership_count: number;
}

export default function OwnerDashboard() {
  const { user } = useCurrentUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clubs, setClubs] = useState<ClubWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, clubsRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/clubs"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }

        if (clubsRes.ok) {
          const clubsData = await clubsRes.json();
          setClubs(clubsData.clubs);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format today's date
  const today = new Date().toLocaleDateString("en-IE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 lg:p-10 page-enter">
      {/* Header */}
      <div className="mb-10">
        <p className="font-body text-sm text-charcoal/40 mb-1">{today}</p>
        <h1 className="font-display text-4xl text-charcoal">
          Welcome back{user?.fullName ? `, ${user.fullName}` : ""}
        </h1>
        <p className="font-body text-base text-charcoal/50 mt-1">
          Here&apos;s an overview of all your clubs
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {loading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              label="Total Clubs"
              value={stats?.totalClubs ?? 0}
              accentColor="gold"
              icon={
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              }
            />
            <StatsCard
              label="Total Trainers"
              value={stats?.totalTrainers ?? 0}
              accentColor="gold"
              icon={
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              }
            />
            <StatsCard
              label="Total Customers"
              value={stats?.totalCustomers ?? 0}
              accentColor="success"
              icon={
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              }
            />
            <StatsCard
              label="Active Memberships"
              value={stats?.activeMemberships ?? 0}
              accentColor={
                stats?.expiringSoon && stats.expiringSoon > 0
                  ? "warning"
                  : "gold"
              }
              icon={
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              }
              trend={
                stats?.expiringSoon && stats.expiringSoon > 0
                  ? {
                      value: `${stats.expiringSoon} expiring soon`,
                      positive: false,
                    }
                  : undefined
              }
            />
          </>
        )}
      </div>

      {/* Clubs section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-charcoal">Your Clubs</h2>
          <span className="font-body text-sm text-charcoal/40">
            {clubs.length} club{clubs.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading ? (
            <>
              <ClubCardSkeleton />
              <ClubCardSkeleton />
              <ClubCardSkeleton />
            </>
          ) : clubs.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-charcoal mb-1">
                No clubs yet
              </h3>
              <p className="font-body text-sm text-charcoal/40">
                Clubs will appear here once they are added to the system.
              </p>
            </div>
          ) : (
            clubs.map((club) => (
              <ClubSummaryCard
                key={club.id}
                id={club.id}
                name={club.name}
                address={club.address}
                logoUrl={club.logo_url}
                trainerCount={club.trainer_count}
                customerCount={club.customer_count}
                activeMembershipCount={club.active_membership_count}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
