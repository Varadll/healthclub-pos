'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';

interface FormData {
  full_name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  gender: string;
  goal: string;
  notes: string;
  starting_weight: string;
}

const INITIAL_FORM: FormData = {
  full_name: '',
  phone: '',
  email: '',
  date_of_birth: '',
  gender: '',
  goal: '',
  notes: '',
  starting_weight: '',
};

const GOALS = [
  'Weight Loss',
  'Weight Gain',
  'Muscle Building',
  'General Fitness',
  'Better Nutrition',
  'Energy & Vitality',
];

export default function AddCustomerForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useCurrentUser();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.full_name.trim()) {
      setError('Customer name is required.');
      return;
    }
    if (!form.starting_weight || parseFloat(form.starting_weight) <= 0) {
      setError('Starting weight is required.');
      return;
    }
    if (!form.gender) {
      setError('Please select a gender.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          date_of_birth: form.date_of_birth || null,
          gender: form.gender || null,
          goal: form.goal || null,
          notes: form.notes.trim() || null,
          starting_weight: parseFloat(form.starting_weight),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add customer');
      }

      const { customer } = await res.json();
      router.push(`/dashboard/trainer/customers/${customer.id}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error banner */}
      {error && (
        <div className="rounded-xl bg-danger-bg border border-danger/20 px-4 py-3">
          <p className="text-[13px] text-danger font-medium">{error}</p>
        </div>
      )}

      {/* Name + Phone row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-medium text-charcoal/50 uppercase tracking-wider mb-2">
            Full Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="e.g. Mary O'Sullivan"
            className="
              w-full h-[48px] rounded-xl border border-border bg-surface-raised
              px-4 text-[14px] font-body text-charcoal
              placeholder:text-charcoal/30
              focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10
              transition-all duration-200
            "
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-charcoal/50 uppercase tracking-wider mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. 087 123 4567"
            className="
              w-full h-[48px] rounded-xl border border-border bg-surface-raised
              px-4 text-[14px] font-body text-charcoal
              placeholder:text-charcoal/30
              focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* Email + DOB row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-medium text-charcoal/50 uppercase tracking-wider mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="e.g. mary@example.com"
            className="
              w-full h-[48px] rounded-xl border border-border bg-surface-raised
              px-4 text-[14px] font-body text-charcoal
              placeholder:text-charcoal/30
              focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10
              transition-all duration-200
            "
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-charcoal/50 uppercase tracking-wider mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            className="
              w-full h-[48px] rounded-xl border border-border bg-surface-raised
              px-4 text-[14px] font-body text-charcoal
              focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* Gender + Goal row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-medium text-charcoal/50 uppercase tracking-wider mb-2">
            Gender <span className="text-danger">*</span>
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="
              w-full h-[48px] rounded-xl border border-border bg-surface-raised
              px-4 text-[14px] font-body text-charcoal
              focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10
              transition-all duration-200
              appearance-none
            "
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-charcoal/50 uppercase tracking-wider mb-2">
            Goal
          </label>
          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            className="
              w-full h-[48px] rounded-xl border border-border bg-surface-raised
              px-4 text-[14px] font-body text-charcoal
              focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10
              transition-all duration-200
              appearance-none
            "
          >
            <option value="">Select goal</option>
            {GOALS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Starting Weight */}
      <div className="max-w-xs">
        <label className="block text-[12px] font-medium text-charcoal/50 uppercase tracking-wider mb-2">
          Starting Weight (kg) <span className="text-danger">*</span>
        </label>
        <input
          type="number"
          name="starting_weight"
          value={form.starting_weight}
          onChange={handleChange}
          step="0.1"
          min="20"
          max="300"
          placeholder="e.g. 82.5"
          className="
            w-full h-[48px] rounded-xl border border-border bg-surface-raised
            px-4 text-[14px] font-body text-charcoal
            placeholder:text-charcoal/30
            focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10
            transition-all duration-200
          "
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[12px] font-medium text-charcoal/50 uppercase tracking-wider mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any health conditions, dietary preferences, etc."
          className="
            w-full rounded-xl border border-border bg-surface-raised
            px-4 py-3 text-[14px] font-body text-charcoal
            placeholder:text-charcoal/30 resize-none
            focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10
            transition-all duration-200
          "
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="
            h-[48px] px-8 rounded-xl
            bg-gold text-charcoal font-body font-medium text-[14px]
            hover:bg-gold-light active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            shadow-sm hover:shadow-luxury
          "
        >
          {submitting ? 'Adding...' : 'Add Customer'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="
            h-[48px] px-6 rounded-xl
            border border-border text-charcoal/50 font-body text-[14px]
            hover:text-charcoal hover:border-border-strong
            transition-all duration-200
          "
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
