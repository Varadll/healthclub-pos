'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProfileHeaderSkeleton, MembershipFormSkeleton, LightSkeleton } from '@/components/ui/skeleton';
import ProfileHeader from '@/components/customers/profile-header';
import MembershipStatusBadge from '@/components/memberships/membership-status-badge';
import MembershipCreateForm from '@/components/memberships/membership-create-form';
import VisitLogButton from '@/components/memberships/visit-log-button';
import { useCurrentUser } from '@/hooks/use-current-user';

interface CustomerDetail {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  gender: string | null;
  goal: string | null;
  starting_weight: number | null;
  notes: string | null;
  created_at: string;
  club_id: string;
  trainer_id: string;
  active_membership: {
    id: string;
    type: '10-day' | '30-day';
    total_days: number;
    days_remaining: number;
    price: number;
    status: 'active' | 'expired' | 'pending';
    started_at: string;
    expires_at: string | null;
  } | null;
  latest_weight: {
    weight_kg: number;
    log_date: string;
  } | null;
  weight_change: number | null;
  trainer: { id: string; full_name: string } | null;
  club: { id: string; name: string; logo_url: string | null } | null;
}

export default function CustomerProfilePage() {
  const params = useParams();
  const customerId = params.customerId as string;
  const { user } = useCurrentUser();

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomer = useCallback(async () => {
    try {
      const res = await fetch(`/api/customers/${customerId}`);
      if (!res.ok) {
        setError('Customer not found');
        return;
      }
      const { customer: data } = await res.json();
      setCustomer(data);
    } catch {
      setError('Failed to load customer');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const handleRefresh = () => {
    setLoading(true);
    fetchCustomer();
  };

  // ─── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-enter max-w-3xl">
        <LightSkeleton className="h-5 w-40 mb-6" />
        <ProfileHeaderSkeleton />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <LightSkeleton className="h-24 rounded-2xl" />
          <LightSkeleton className="h-24 rounded-2xl" />
          <LightSkeleton className="h-24 rounded-2xl" />
          <LightSkeleton className="h-24 rounded-2xl" />
        </div>
        <MembershipFormSkeleton />
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────
  if (error || !customer) {
    return (
      <div className="page-enter text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-danger-bg flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-danger">!</span>
        </div>
        <h2 className="text-[18px] font-display font-semibold text-charcoal mb-1">
          {error || 'Customer not found'}
        </h2>
        <Link
          href="/dashboard/trainer/customers"
          className="text-[13px] text-gold hover:text-gold-light transition-colors mt-3 inline-block"
        >
          ← Back to customers
        </Link>
      </div>
    );
  }

  // ─── Derived data ───────────────────────────────────────────────
  const membership = customer.active_membership;
  const membershipStatus: 'active' | 'expired' | 'none' = membership
    ? membership.status === 'active'
      ? 'active'
      : 'expired'
    : 'none';
  const daysRemaining = membership?.days_remaining ?? null;
  const currentWeight = customer.latest_weight?.weight_kg ?? customer.starting_weight;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="page-enter max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-charcoal/40 font-body mb-6">
        <Link
          href="/dashboard/trainer/customers"
          className="hover:text-charcoal transition-colors"
        >
          My Customers
        </Link>
        <span className="text-charcoal/20">›</span>
        <span className="text-charcoal/60 truncate">{customer.full_name}</span>
      </div>

      {/* ─── Profile Header ─────────────────────────────────────── */}
      <ProfileHeader
        fullName={customer.full_name}
        clubName={customer.club?.name ?? null}
        clubLogoUrl={customer.club?.logo_url ?? null}
        joinDate={customer.created_at}
        startingWeight={customer.starting_weight}
        membershipStatus={membershipStatus}
        daysRemaining={daysRemaining}
        membershipType={membership?.type ?? null}
      />

      {/* ─── Quick Stats Row ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Current Weight */}
        <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-sm">
          <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-body mb-1">
            Current Weight
          </p>
          <p className="text-[22px] font-display font-semibold text-charcoal">
            {currentWeight ? `${currentWeight} kg` : '—'}
          </p>
        </div>

        {/* Weight Change */}
        <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-sm">
          <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-body mb-1">
            Change
          </p>
          {customer.weight_change !== null ? (
            <p
              className={`text-[22px] font-display font-semibold ${
                customer.weight_change <= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {customer.weight_change <= 0 ? '↓' : '↑'}{' '}
              {Math.abs(customer.weight_change).toFixed(1)} kg
            </p>
          ) : (
            <p className="text-[22px] font-display font-semibold text-charcoal/30">—</p>
          )}
        </div>

        {/* Days Remaining */}
        <div
          className={`rounded-2xl border p-4 shadow-sm ${
            daysRemaining !== null && daysRemaining <= 1
              ? 'border-danger/30 bg-danger-bg'
              : daysRemaining !== null && daysRemaining <= 3
              ? 'border-warning/30 bg-warning-bg'
              : 'border-border bg-surface-raised'
          }`}
        >
          <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-body mb-1">
            Days Left
          </p>
          {daysRemaining !== null ? (
            <p
              className={`text-[22px] font-display font-semibold ${
                daysRemaining <= 1
                  ? 'text-danger'
                  : daysRemaining <= 3
                  ? 'text-warning'
                  : 'text-gold'
              }`}
            >
              {daysRemaining}
            </p>
          ) : (
            <p className="text-[22px] font-display font-semibold text-charcoal/30">—</p>
          )}
        </div>

        {/* Goal */}
        <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-sm">
          <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-body mb-1">
            Goal
          </p>
          <p className="text-[14px] font-body font-medium text-charcoal/70 mt-1 truncate">
            {customer.goal || '—'}
          </p>
        </div>
      </div>

      {/* ─── Visit Check-In ─────────────────────────────────────── */}
      {membership && membership.status === 'active' && membership.days_remaining > 0 && user && (
        <div className="mb-6">
          <VisitLogButton
            customerId={customer.id}
            membershipId={membership.id}
            clubId={customer.club_id}
            trainerId={user.id}
            daysRemaining={membership.days_remaining}
            onVisitLogged={handleRefresh}
          />
        </div>
      )}

      {/* ─── Membership Section ─────────────────────────────────── */}
      <div className="mb-6">
        {/* Active membership details */}
        {membership && membership.status === 'active' && (
          <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-display font-semibold text-charcoal">
                Active Membership
              </h3>
              <MembershipStatusBadge
                status="active"
                daysRemaining={membership.days_remaining}
                type={membership.type}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-body mb-1">
                  Plan
                </p>
                <p className="text-[15px] font-body font-medium text-charcoal">
                  {membership.type === '10-day' ? '10-Day' : '30-Day'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-body mb-1">
                  Price
                </p>
                <p className="text-[15px] font-body font-medium text-charcoal">
                  €{membership.price.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-body mb-1">
                  Started
                </p>
                <p className="text-[15px] font-body font-medium text-charcoal">
                  {formatDate(membership.started_at)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-body mb-1">
                  Used
                </p>
                <p className="text-[15px] font-body font-medium text-charcoal">
                  {membership.total_days - membership.days_remaining} of {membership.total_days} days
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="h-2 rounded-full bg-surface-sunken overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    membership.days_remaining <= 1
                      ? 'bg-danger'
                      : membership.days_remaining <= 3
                      ? 'bg-warning'
                      : 'bg-gold'
                  }`}
                  style={{
                    width: `${(membership.days_remaining / membership.total_days) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[11px] font-body text-charcoal/35 mt-1.5 text-right">
                {membership.days_remaining} of {membership.total_days} days remaining
              </p>
            </div>
          </div>
        )}

        {/* Create / Renew membership form */}
        <MembershipCreateForm
          customerId={customer.id}
          clubId={customer.club_id}
          hasActiveMembership={membershipStatus === 'active'}
          onCreated={handleRefresh}
        />
      </div>

      {/* ─── Upcoming Batches Placeholder ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-border border-dashed bg-surface-sunken/50 py-10 text-center">
          <div className="w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-charcoal/25">
              <path d="M3 17L3 3M3 10H17M17 10L12 5M17 10L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[13px] text-charcoal/30 font-body">
            Weight tracking — Batch 6
          </p>
        </div>
        <div className="rounded-2xl border border-border border-dashed bg-surface-sunken/50 py-10 text-center">
          <div className="w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-charcoal/25">
              <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <p className="text-[13px] text-charcoal/30 font-body">
            Scan photos — Batch 7
          </p>
        </div>
      </div>
    </div>
  );
}
