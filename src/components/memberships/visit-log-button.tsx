'use client';

import { useState } from 'react';
import ConfirmDialog from '@/components/ui/confirm-dialog';

interface VisitLogButtonProps {
  customerId: string;
  membershipId: string;
  clubId: string;
  trainerId: string;
  daysRemaining: number;
  onVisitLogged: () => void;
}

export default function VisitLogButton({
  customerId,
  membershipId,
  clubId,
  trainerId,
  daysRemaining,
  onVisitLogged,
}: VisitLogButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleLogVisit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          membership_id: membershipId,
          club_id: clubId,
          trainer_id: trainerId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to log visit');
        setShowConfirm(false);
        return;
      }

      setShowConfirm(false);
      setSuccess(true);
      onVisitLogged();

      // Reset success after 2s
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError('Something went wrong');
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <button
        disabled
        className="
          w-full h-14 rounded-xl bg-success text-white
          text-[15px] font-body font-medium
          flex items-center justify-center gap-2
        "
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Visit Logged — {daysRemaining - 1} days left
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="
          w-full h-14 rounded-xl bg-charcoal text-white
          text-[15px] font-body font-medium tracking-wide
          hover:bg-charcoal-soft transition-all duration-200
          active:scale-[0.98]
        "
      >
        Check In Today
      </button>

      {error && (
        <p className="text-[13px] font-body text-danger mt-2 text-center">{error}</p>
      )}

      <ConfirmDialog
        open={showConfirm}
        title="Log Today's Visit?"
        description={`This will deduct 1 day from the membership. ${daysRemaining} days remaining → ${daysRemaining - 1} days after check-in.`}
        confirmLabel="Confirm Check-In"
        cancelLabel="Cancel"
        loading={loading}
        onConfirm={handleLogVisit}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
