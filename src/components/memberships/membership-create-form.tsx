'use client';

import { useState } from 'react';

interface MembershipCreateFormProps {
  customerId: string;
  clubId: string;
  hasActiveMembership: boolean;
  onCreated: () => void;
}

const PLANS = [
  { type: '10-day' as const, days: 10, price: 65, label: '10-Day Plan' },
  { type: '30-day' as const, days: 30, price: 180, label: '30-Day Plan' },
];

export default function MembershipCreateForm({
  customerId,
  clubId,
  hasActiveMembership,
  onCreated,
}: MembershipCreateFormProps) {
  const [selectedPlan, setSelectedPlan] = useState<'10-day' | '30-day' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          club_id: clubId,
          type: selectedPlan,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create membership');
        return;
      }

      setSelectedPlan(null);
      onCreated();
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
      <h3 className="text-[18px] font-display font-semibold text-charcoal mb-1">
        {hasActiveMembership ? 'Renew Membership' : 'Create Membership'}
      </h3>
      <p className="text-[13px] font-body text-charcoal/45 mb-5">
        {hasActiveMembership
          ? 'Current plan is still active. Creating a new plan will replace it.'
          : 'Choose a plan to get started.'}
      </p>

      {/* Plan cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.type;
          return (
            <button
              key={plan.type}
              onClick={() => setSelectedPlan(plan.type)}
              className={`
                relative rounded-xl border-2 p-5 text-left transition-all duration-200
                ${isSelected
                  ? 'border-gold bg-gold-muted shadow-luxury'
                  : 'border-border bg-white hover:border-gold/40'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#1C1C1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <p className="text-[13px] font-body font-medium text-charcoal/60 mb-1">
                {plan.label}
              </p>
              <p className="text-[28px] font-display font-semibold text-charcoal">
                €{plan.price}
              </p>
              <p className="text-[12px] font-body text-charcoal/40 mt-1">
                {plan.days} days · €{(plan.price / plan.days).toFixed(2)}/day
              </p>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-[13px] font-body text-danger mb-4">{error}</p>
      )}

      <button
        onClick={handleCreate}
        disabled={!selectedPlan || loading}
        className="
          w-full h-12 rounded-xl bg-gold text-charcoal
          text-[14px] font-body font-medium tracking-wide
          hover:bg-gold-light transition-all duration-200
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
            Creating…
          </span>
        ) : selectedPlan ? (
          `Activate ${selectedPlan === '10-day' ? '10-Day' : '30-Day'} Plan`
        ) : (
          'Select a plan'
        )}
      </button>
    </div>
  );
}
