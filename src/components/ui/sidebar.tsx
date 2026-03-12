'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';

const NAV_ITEMS: Record<string, { label: string; href: string; icon: string }[]> = {
  owner: [
    { label: 'Dashboard', href: '/dashboard/owner', icon: '◈' },
    { label: 'All Clubs', href: '/dashboard/owner/clubs', icon: '◆' },
  ],
  manager: [
    { label: 'Dashboard', href: '/dashboard/manager', icon: '◈' },
    { label: 'Customers', href: '/dashboard/manager/customers', icon: '◇' },
  ],
  trainer: [
    { label: 'Dashboard', href: '/dashboard/trainer', icon: '◈' },
    { label: 'My Customers', href: '/dashboard/trainer/customers', icon: '◇' },
    { label: 'Add Customer', href: '/dashboard/trainer/customers/new', icon: '＋' },
  ],
};

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useCurrentUser();

  // Derive role from user object — NOT destructured separately
  const role = user?.role || 'trainer';

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navItems = NAV_ITEMS[role] || [];

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === `/dashboard/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
            <span className="text-gold text-lg">♥</span>
          </div>
          <div>
            <h1 className="text-[15px] font-display font-semibold text-white tracking-wide">
              HealthPOS
            </h1>
            <p className="text-[11px] text-white/40 uppercase tracking-[0.15em]">
              Club Manager
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-body
                transition-all duration-200 min-h-[48px]
                ${active
                  ? 'bg-gold/[0.12] text-gold font-medium shadow-[inset_0_0_0_1px_rgba(201,168,76,0.15)]'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                }
              `}
            >
              <span className={`text-base ${active ? 'text-gold' : 'text-white/30'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Sign Out */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        {!loading && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-[13px] text-white/80 font-medium truncate">
              {user.fullName}
            </p>
            <p className="text-[11px] text-white/35 capitalize">
              {role}
            </p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="
            w-full flex items-center gap-3 px-4 py-3 rounded-xl
            text-[13px] text-white/40 hover:text-red-400 hover:bg-red-500/[0.08]
            transition-all duration-200 min-h-[48px]
          "
        >
          <span className="text-base">⏻</span>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="
          lg:hidden fixed top-4 left-4 z-50
          w-11 h-11 rounded-xl bg-charcoal border border-white/[0.08]
          flex items-center justify-center
          shadow-lg shadow-black/30
        "
        aria-label="Open menu"
      >
        <span className="text-white/70 text-lg">☰</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 z-50 h-full w-[280px]
          bg-charcoal border-r border-white/[0.06]
          transform transition-transform duration-300 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70"
          aria-label="Close menu"
        >
          ✕
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[260px] lg:min-h-screen bg-charcoal border-r border-white/[0.06]">
        {sidebarContent}
      </aside>
    </>
  );
}
