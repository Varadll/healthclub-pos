'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StatsCard from '@/components/dashboard/stats-card';
import { Skeleton, StatsCardSkeleton } from '@/components/ui/skeleton';

interface Trainer {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface CustomerMembership {
  type: string;
  daysRemaining: number;
  status: string;
}

interface Customer {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  gender: string | null;
  startDate: string | null;
  goal: string | null;
  activeMembership: CustomerMembership | null;
}

interface ClubDetail {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  trainers: Trainer[];
  customers: Customer[];
}

export default function ClubDetailPage() {
  const params = useParams();
  const clubId = params.clubId as string;
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClub() {
      try {
        const res = await fetch(`/api/clubs/${clubId}`);
        if (!res.ok) throw new Error('Club not found');
        const data = await res.json();
        setClub(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (clubId) fetchClub();
  }, [clubId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-3 gap-4">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-white/40 text-[15px] mb-4">Club not found</p>
        <Link
          href="/dashboard/owner/clubs"
          className="text-gold text-[14px] hover:underline"
        >
          ← Back to all clubs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Link + Header */}
      <div>
        <Link
          href="/dashboard/owner/clubs"
          className="text-[13px] text-white/30 hover:text-gold transition-colors inline-flex items-center gap-1 mb-4"
        >
          ← All Clubs
        </Link>

        <div className="flex items-center gap-4">
          {club.logoUrl ? (
            <img
              src={club.logoUrl}
              alt={`${club.name} logo`}
              className="w-14 h-14 rounded-xl object-cover border border-white/[0.06]"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
              <span className="text-gold font-heading font-semibold text-[18px]">
                {club.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-heading font-semibold text-white">
              {club.name}
            </h1>
            <p className="text-[13px] text-white/35">
              {club.address}
              {club.phone && ` · ${club.phone}`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Trainers"
          value={club.trainers.length}
          icon="◈"
        />
        <StatsCard
          label="Customers"
          value={club.customers.length}
          icon="◇"
        />
        <StatsCard
          label="Active Plans"
          value={club.customers.filter(c => c.activeMembership?.status === 'active').length}
          icon="♦"
        />
      </div>

      {/* Trainers Table */}
      <div>
        <h2 className="text-[16px] font-heading font-semibold text-white mb-4">
          Staff
        </h2>
        {club.trainers.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-charcoal/40 px-6 py-10 text-center">
            <p className="text-white/30 text-[14px]">No staff assigned to this club yet</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-charcoal/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-6 py-4 text-[11px] text-white/30 uppercase tracking-[0.12em] font-body font-medium">Name</th>
                    <th className="text-left px-6 py-4 text-[11px] text-white/30 uppercase tracking-[0.12em] font-body font-medium">Email</th>
                    <th className="text-left px-6 py-4 text-[11px] text-white/30 uppercase tracking-[0.12em] font-body font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {club.trainers.map((trainer) => (
                    <tr key={trainer.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 min-h-[64px]">
                        <span className="text-[14px] text-white font-medium">{trainer.full_name}</span>
                      </td>
                      <td className="px-6 py-4 min-h-[64px]">
                        <span className="text-[13px] text-white/50">{trainer.email}</span>
                      </td>
                      <td className="px-6 py-4 min-h-[64px]">
                        <span className="text-[12px] text-gold/70 bg-gold/[0.08] px-2.5 py-1 rounded-full capitalize">{trainer.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div>
        <h2 className="text-[16px] font-heading font-semibold text-white mb-4">
          Customers
        </h2>
        {club.customers.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-charcoal/40 px-6 py-10 text-center">
            <p className="text-white/30 text-[14px]">No customers registered at this club yet</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-charcoal/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-6 py-4 text-[11px] text-white/30 uppercase tracking-[0.12em] font-body font-medium">Name</th>
                    <th className="text-left px-6 py-4 text-[11px] text-white/30 uppercase tracking-[0.12em] font-body font-medium">Contact</th>
                    <th className="text-left px-6 py-4 text-[11px] text-white/30 uppercase tracking-[0.12em] font-body font-medium">Goal</th>
                    <th className="text-left px-6 py-4 text-[11px] text-white/30 uppercase tracking-[0.12em] font-body font-medium">Membership</th>
                    <th className="text-left px-6 py-4 text-[11px] text-white/30 uppercase tracking-[0.12em] font-body font-medium">Days Left</th>
                  </tr>
                </thead>
                <tbody>
                  {club.customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 min-h-[64px]">
                        <span className="text-[14px] text-white font-medium">{customer.fullName}</span>
                      </td>
                      <td className="px-6 py-4 min-h-[64px]">
                        <div>
                          {customer.phone && <p className="text-[13px] text-white/50">{customer.phone}</p>}
                          {customer.email && <p className="text-[12px] text-white/30">{customer.email}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4 min-h-[64px]">
                        <span className="text-[13px] text-white/50">{customer.goal || '—'}</span>
                      </td>
                      <td className="px-6 py-4 min-h-[64px]">
                        {customer.activeMembership ? (
                          <span className="text-[12px] text-gold/70 bg-gold/[0.08] px-2.5 py-1 rounded-full">
                            {customer.activeMembership.type}
                          </span>
                        ) : (
                          <span className="text-[12px] text-white/20">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 min-h-[64px]">
                        {customer.activeMembership ? (
                          <span className={`text-[14px] font-medium ${
                            customer.activeMembership.daysRemaining <= 2
                              ? 'text-health-red'
                              : customer.activeMembership.daysRemaining <= 5
                                ? 'text-amber-400'
                                : 'text-health-green'
                          }`}>
                            {customer.activeMembership.daysRemaining}d
                          </span>
                        ) : (
                          <span className="text-[13px] text-white/20">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
