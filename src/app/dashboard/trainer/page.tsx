'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';
import TrainerStatsCard from '@/components/dashboard/trainer-stats-card';
import CustomerCard from '@/components/customers/customer-card';
import { TrainerStatsCardSkeleton, CustomerCardSkeleton } from '@/components/ui/skeleton';

interface TrainerStats {
  total_customers: number;
  active_memberships: number;
  expiring_soon: number;
  today_visits: number;
}

interface EnrichedCustomer {
  id: string;
  full_name: string;
  phone: string | null;
  gender: string | null;
  goal: string | null;
  starting_weight: number | null;
  membership_status: 'active' | 'expired' | 'none';
  days_remaining: number | null;
  last_weight: number | null;
  weight_change: number | null;
}

export default function TrainerDashboard() {
  const { user, loading: userLoading } = useCurrentUser();
  const [stats, setStats] = useState<TrainerStats | null>(null);
  const [recentCustomers, setRecentCustomers] = useState<EnrichedCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading || !user) return;

    const fetchData = async () => {
      try {
        const [statsRes, custRes] = await Promise.all([
          fetch('/api/trainer/stats'),
          fetch('/api/customers'),
        ]);

        if (statsRes.ok) {
          const { stats: s } = await statsRes.json();
          setStats(s);
        }

        if (custRes.ok) {
          const { customers } = await custRes.json();
          // Show latest 5 on dashboard
          setRecentCustomers(customers.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to fetch trainer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userLoading]);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-display font-semibold text-charcoal leading-tight">
          {greeting}{user ? `, ${user.fullName.split(' ')[0]}` : ''}
        </h1>
        <p className="text-[14px] text-charcoal/45 font-body mt-1">
          Here's how your club is doing today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {loading ? (
          <>
            <TrainerStatsCardSkeleton />
            <TrainerStatsCardSkeleton />
            <TrainerStatsCardSkeleton />
            <TrainerStatsCardSkeleton />
          </>
        ) : stats ? (
          <>
            <TrainerStatsCard
              label="My Customers"
              value={stats.total_customers}
              icon="◇"
              accentColor="gold"
              subtitle="Total registered"
            />
            <TrainerStatsCard
              label="Active Plans"
              value={stats.active_memberships}
              icon="◈"
              accentColor="success"
              subtitle="Currently active"
            />
            <TrainerStatsCard
              label="Expiring Soon"
              value={stats.expiring_soon}
              icon="⚠"
              accentColor={stats.expiring_soon > 0 ? 'danger' : 'default'}
              subtitle="≤ 3 days left"
            />
            <TrainerStatsCard
              label="Today's Visits"
              value={stats.today_visits}
              icon="✓"
              accentColor="default"
              subtitle={new Date().toLocaleDateString('en-IE', { weekday: 'long' })}
            />
          </>
        ) : null}
      </div>

      {/* Recent Customers Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[20px] font-display font-semibold text-charcoal">
              Recent Customers
            </h2>
            <p className="text-[13px] text-charcoal/40 mt-0.5">
              Your latest registered customers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/trainer/customers"
              className="
                h-[40px] px-4 rounded-xl border border-border
                flex items-center text-[13px] font-body text-charcoal/50
                hover:text-charcoal hover:border-border-strong
                transition-all duration-200
              "
            >
              View All
            </Link>
            <Link
              href="/dashboard/trainer/customers/new"
              className="
                h-[40px] px-4 rounded-xl
                bg-gold text-charcoal font-body font-medium text-[13px]
                flex items-center gap-1.5
                hover:bg-gold-light transition-all duration-200
                shadow-sm hover:shadow-luxury
              "
            >
              <span className="text-[16px]">+</span> Add Customer
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomerCardSkeleton />
            <CustomerCardSkeleton />
            <CustomerCardSkeleton />
            <CustomerCardSkeleton />
          </div>
        ) : recentCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentCustomers.map((c) => (
              <CustomerCard
                key={c.id}
                id={c.id}
                fullName={c.full_name}
                phone={c.phone}
                gender={c.gender}
                goal={c.goal}
                membershipStatus={c.membership_status}
                daysRemaining={c.days_remaining}
                lastWeight={c.last_weight}
                weightChange={c.weight_change}
                startingWeight={c.starting_weight}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border border-dashed bg-surface-sunken/50 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gold/[0.08] flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gold/60">◇</span>
            </div>
            <h3 className="text-[16px] font-display font-semibold text-charcoal/70 mb-1">
              No customers yet
            </h3>
            <p className="text-[13px] text-charcoal/40 mb-5">
              Add your first customer to get started
            </p>
            <Link
              href="/dashboard/trainer/customers/new"
              className="
                inline-flex items-center gap-1.5 h-[44px] px-6 rounded-xl
                bg-gold text-charcoal font-body font-medium text-[14px]
                hover:bg-gold-light transition-all duration-200
                shadow-sm hover:shadow-luxury
              "
            >
              <span className="text-[18px]">+</span> Add First Customer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
