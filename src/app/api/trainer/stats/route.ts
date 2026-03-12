import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/trainer/stats — stats for the logged-in trainer
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: appUser } = await supabase
      .from('app_users')
      .select('id, role, club_id')
      .eq('auth_id', user.id)
      .single();

    if (!appUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. Total customers for this trainer
    const { count: customerCount } = await supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .eq('trainer_id', appUser.id);

    // 2. Active memberships for this trainer's customers
    const { data: trainerCustomers } = await supabase
      .from('customers')
      .select('id')
      .eq('trainer_id', appUser.id);

    const customerIds = trainerCustomers?.map((c) => c.id) || [];

    let activeMembershipCount = 0;
    let expiringCount = 0;

    if (customerIds.length > 0) {
      const { count: activeCount } = await supabase
        .from('memberships')
        .select('id', { count: 'exact', head: true })
        .in('customer_id', customerIds)
        .eq('status', 'active');

      activeMembershipCount = activeCount || 0;

      // Expiring soon (3 days or less remaining)
      const { count: expiring } = await supabase
        .from('memberships')
        .select('id', { count: 'exact', head: true })
        .in('customer_id', customerIds)
        .eq('status', 'active')
        .lte('days_remaining', 3);

      expiringCount = expiring || 0;
    }

    // 3. Today's visits
    const today = new Date().toISOString().split('T')[0];
    const { count: todayVisits } = await supabase
      .from('visits')
      .select('id', { count: 'exact', head: true })
      .eq('trainer_id', appUser.id)
      .gte('visited_at', `${today}T00:00:00`)
      .lt('visited_at', `${today}T23:59:59`);

    return NextResponse.json({
      stats: {
        total_customers: customerCount || 0,
        active_memberships: activeMembershipCount,
        expiring_soon: expiringCount,
        today_visits: todayVisits || 0,
      },
    });
  } catch (err: any) {
    console.error('Trainer stats error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
