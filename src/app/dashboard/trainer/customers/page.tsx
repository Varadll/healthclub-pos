'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';
import CustomerCard from '@/components/customers/customer-card';
import { CustomerCardSkeleton } from '@/components/ui/skeleton';

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

type FilterStatus = 'all' | 'active' | 'expired' | 'none';

export default function TrainerCustomerList() {
  const { user, loading: userLoading } = useCurrentUser();
  const [customers, setCustomers] = useState<EnrichedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`/api/customers?${params.toString()}`);
      if (res.ok) {
        const { customers: data } = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (userLoading || !user) return;
    fetchCustomers();
  }, [user, userLoading, fetchCustomers]);

  // Client-side filter by membership status
  const filtered = filter === 'all'
    ? customers
    : customers.filter((c) => c.membership_status === filter);

  const filterButtons: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Expired', value: 'expired' },
    { label: 'No Plan', value: 'none' },
  ];

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-display font-semibold text-charcoal">
            My Customers
          </h1>
          <p className="text-[13px] text-charcoal/40 mt-0.5">
            {customers.length} customer{customers.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Link
          href="/dashboard/trainer/customers/new"
          className="
            h-[48px] px-6 rounded-xl
            bg-gold text-charcoal font-body font-medium text-[14px]
            inline-flex items-center gap-2
            hover:bg-gold-light transition-all duration-200
            shadow-sm hover:shadow-luxury
          "
        >
          <span className="text-[18px]">+</span> Add Customer
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30 text-[14px]">
            ⌕
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="
              w-full h-[48px] pl-10 pr-4 rounded-xl
              border border-border bg-surface-raised
              text-[14px] font-body text-charcoal
              placeholder:text-charcoal/30
              focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10
              transition-all duration-200
            "
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2">
          {filterButtons.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`
                h-[48px] px-4 rounded-xl text-[13px] font-body font-medium
                border transition-all duration-200
                ${filter === f.value
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'bg-surface-raised text-charcoal/50 border-border hover:text-charcoal hover:border-border-strong'
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomerCardSkeleton />
          <CustomerCardSkeleton />
          <CustomerCardSkeleton />
          <CustomerCardSkeleton />
          <CustomerCardSkeleton />
          <CustomerCardSkeleton />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => (
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
          <div className="w-14 h-14 rounded-2xl bg-charcoal/[0.04] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-charcoal/20">⌕</span>
          </div>
          <h3 className="text-[16px] font-display font-semibold text-charcoal/60 mb-1">
            {search || filter !== 'all' ? 'No customers match your search' : 'No customers yet'}
          </h3>
          <p className="text-[13px] text-charcoal/35">
            {search || filter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Add your first customer to get started'}
          </p>
        </div>
      )}
    </div>
  );
}
