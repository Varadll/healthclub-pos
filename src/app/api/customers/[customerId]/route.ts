import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/customers/:customerId — single customer with membership + weight data
export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customerId } = params;

    // Fetch customer
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (error || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Fetch active membership
    // Actual columns: id, customer_id, type, price, start_date, end_date, days_remaining, status, created_at
    const { data: activeMembership } = await supabase
      .from('memberships')
      .select('*')
      .eq('customer_id', customerId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Normalize membership to what the frontend expects
    const normalizedMembership = activeMembership
      ? {
          id: activeMembership.id,
          type: activeMembership.type,
          total_days: activeMembership.type === '10-day' ? 10 : 30,
          days_remaining: activeMembership.days_remaining,
          price: activeMembership.price,
          status: activeMembership.status,
          started_at: activeMembership.start_date,
          expires_at: activeMembership.end_date,
        }
      : null;

    // Fetch latest weight log
    const { data: latestWeight } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('customer_id', customerId)
      .order('log_date', { ascending: false })
      .limit(1)
      .single();

    // Fetch trainer name
    const { data: trainer } = await supabase
      .from('app_users')
      .select('id, full_name')
      .eq('id', customer.trainer_id)
      .single();

    // Fetch club name
    const { data: club } = await supabase
      .from('clubs')
      .select('id, name, logo_url')
      .eq('id', customer.club_id)
      .single();

    return NextResponse.json({
      customer: {
        ...customer,
        active_membership: normalizedMembership,
        latest_weight: latestWeight || null,
        trainer: trainer || null,
        club: club || null,
        weight_change: latestWeight && customer.starting_weight
          ? parseFloat((latestWeight.weight_kg - customer.starting_weight).toFixed(1))
          : null,
      },
    });
  } catch (err: any) {
    console.error('Customer detail error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
