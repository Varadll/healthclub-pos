import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createClient();

    // Parallel queries for speed
    const [clubsRes, usersRes, customersRes, membershipsRes] = await Promise.all([
      supabase.from('clubs').select('id', { count: 'exact', head: true }),
      supabase.from('app_users').select('id', { count: 'exact', head: true }).in('role', ['manager', 'trainer']),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('memberships').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    ]);

    return NextResponse.json({
      totalClubs: clubsRes.count ?? 0,
      totalStaff: usersRes.count ?? 0,
      totalCustomers: customersRes.count ?? 0,
      activeMemberships: membershipsRes.count ?? 0,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
