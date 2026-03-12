"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/stats-card";
import { StatsCardSkeleton, Skeleton } from "@/components/ui/skeleton";

interface Club {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
}

interface Trainer {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface Customer {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  trainer_id: string;
}

interface Membership {
  id: string;
  customer_id: string;
  type: string;
  days_remaining: number;
  status: string;
}

export default function ClubDetailPage() {
  const params = useParams();
  const clubId = params.clubId as string;

  const [club, setClub] = useState<Club | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await fetch(`/api/clubs/${clubId}`);
        if (res.ok) {
          const data = await res.json();
          setClub(data.club);
          setTrainers(data.trainers);
          setCustomers(data.customers);
          setMemberships(data.memberships);
        }
      } catch (error) {
        console.error("Error fetching club:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clubId) fetchClub();
  }, [clubId]);

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="p-6 lg:p-10 text-center py-20">
        <h2 className="font-display text-2xl text-charcoal mb-2">Club not found</h2>
        <Link href="/dashboard/owner/clubs" className="font-body text-gold hover:underline">
          ← Back to all clubs
        </Link>
      </div>
    );
  }

  // Generate initials
  const initials = club.name
    .split(" ")
    .filter((word) => word.length > 0 && word[0] === word[0].toUpperCase())
    .map((word) => word[0])
    .slice(0, 2)
    .join("");

  const expiringSoon = memberships.filter((m) => m.days_remaining <= 3).length;

  return (
    <div className="p-6 lg:p-10 page-enter">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard/owner/clubs"
          className="font-body text-sm text-charcoal/40 hover:text-gold transition-colors"
        >
          ← All Clubs
        </Link>
      </div>

      {/* Club header */}
      <div className="flex items-center gap-5 mb-10">
        {club.logo_url ? (
          <img
            src={club.logo_url}
            alt={`${club.name} logo`}
            className="w-16 h-16 rounded-md object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-md bg-charcoal flex items-center justify-center">
            <span className="font-display text-xl text-gold">{initials}</span>
          </div>
        )}
        <div>
          <h1 className="font-display text-4xl text-charcoal">{club.name}</h1>
          <div className="flex items-center gap-4 mt-1">
            {club.address && (
              <p className="font-body text-sm text-charcoal/40">{club.address}</p>
            )}
            {club.phone && (
              <p className="font-body text-sm text-charcoal/40">📞 {club.phone}</p>
            )}
            {club.email && (
              <p className="font-body text-sm text-charcoal/40">✉ {club.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <StatsCard
          label="Trainers"
          value={trainers.length}
          accentColor="gold"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <StatsCard
          label="Customers"
          value={customers.length}
          accentColor="success"
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          }
        />
        <StatsCard
          label="Active Memberships"
          value={memberships.length}
          accentColor={expiringSoon > 0 ? "warning" : "gold"}
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          }
          trend={
            expiringSoon > 0
              ? { value: `${expiringSoon} expiring soon`, positive: false }
              : undefined
          }
        />
      </div>

      {/* Trainers table */}
      <div className="mb-10">
        <h2 className="font-display text-2xl text-charcoal mb-4">Trainers</h2>
        {trainers.length === 0 ? (
          <div className="bg-surface-raised border border-border rounded-md p-8 text-center">
            <p className="font-body text-sm text-charcoal/40">
              No trainers assigned to this club yet.
            </p>
          </div>
        ) : (
          <div className="bg-surface-raised border border-border rounded-md overflow-hidden">
            <div className="grid grid-cols-3 bg-surface-sunken px-6 py-3 border-b border-border">
              <span className="font-body text-[11px] font-medium text-charcoal/50 uppercase tracking-wider">
                Name
              </span>
              <span className="font-body text-[11px] font-medium text-charcoal/50 uppercase tracking-wider">
                Email
              </span>
              <span className="font-body text-[11px] font-medium text-charcoal/50 uppercase tracking-wider">
                Role
              </span>
            </div>
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="grid grid-cols-3 px-6 items-center border-b border-border last:border-b-0 hover:bg-gold/[0.02] transition-colors"
                style={{ minHeight: "64px" }}
              >
                <span className="font-body text-sm text-charcoal">
                  {trainer.full_name}
                </span>
                <span className="font-body text-sm text-charcoal/60">
                  {trainer.email}
                </span>
                <span className="font-body text-xs text-charcoal/40 capitalize">
                  {trainer.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customers table */}
      <div>
        <h2 className="font-display text-2xl text-charcoal mb-4">Customers</h2>
        {customers.length === 0 ? (
          <div className="bg-surface-raised border border-border rounded-md p-8 text-center">
            <p className="font-body text-sm text-charcoal/40">
              No customers registered at this club yet.
            </p>
          </div>
        ) : (
          <div className="bg-surface-raised border border-border rounded-md overflow-hidden">
            <div className="grid grid-cols-3 bg-surface-sunken px-6 py-3 border-b border-border">
              <span className="font-body text-[11px] font-medium text-charcoal/50 uppercase tracking-wider">
                Name
              </span>
              <span className="font-body text-[11px] font-medium text-charcoal/50 uppercase tracking-wider">
                Phone
              </span>
              <span className="font-body text-[11px] font-medium text-charcoal/50 uppercase tracking-wider">
                Email
              </span>
            </div>
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="grid grid-cols-3 px-6 items-center border-b border-border last:border-b-0 hover:bg-gold/[0.02] transition-colors"
                style={{ minHeight: "64px" }}
              >
                <span className="font-body text-sm text-charcoal">
                  {customer.full_name}
                </span>
                <span className="font-body text-sm text-charcoal/60">
                  {customer.phone || "—"}
                </span>
                <span className="font-body text-sm text-charcoal/60">
                  {customer.email || "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
