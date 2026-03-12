'use client';

import Link from 'next/link';
import AddCustomerForm from '@/components/customers/add-customer-form';

export default function AddCustomerPage() {
  return (
    <div className="page-enter max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-charcoal/40 font-body mb-6">
        <Link
          href="/dashboard/trainer/customers"
          className="hover:text-charcoal transition-colors"
        >
          My Customers
        </Link>
        <span className="text-charcoal/20">›</span>
        <span className="text-charcoal/60">Add New</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-display font-semibold text-charcoal">
          Add New Customer
        </h1>
        <p className="text-[14px] text-charcoal/45 font-body mt-1">
          Register a new customer and record their starting weight
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-border bg-surface-raised p-6 sm:p-8 shadow-sm">
        <AddCustomerForm />
      </div>
    </div>
  );
}
