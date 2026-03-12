"use client";

import { useEffect, useState } from "react";
import { ClubSummaryCard } from "@/components/dashboard/club-summary-card";
import { ClubCardSkeleton } from "@/components/ui/skeleton";

interface ClubWithStats {
  id: string;
  name: string;
  address: string | null;
  logo_url: string | null;
  trainer_count: number;
  customer_count: number;
  active_membership_count: number;
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<ClubWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch("/api/clubs");
        if (res.ok) {
          const data = await res.json();
          setClubs(data.clubs);
        }
      } catch (error) {
        console.error("Error fetching clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div className="p-6 lg:p-10 page-enter">
      <div className="mb-10">
        <h1 className="font-display text-4xl text-charcoal">All Clubs</h1>
        <p className="font-body text-base text-charcoal/50 mt-1">
          Manage and view all your Herbalife nutrition clubs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
              logoUrl={club.logo_url}
              trainerCount={club.trainer_count}
              customerCount={club.customer_count}
              activeMembershipCount={club.active_membership_count}
            />
          ))
        )}
      </div>
    </div>
  );
}
