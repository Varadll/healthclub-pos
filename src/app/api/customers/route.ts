import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/customers — list customers for the logged-in trainer (or all for owner/manager)
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get app_user record to know role + club
    const { data: appUser } = await supabase
      .from('app_users')
      .select('id, role, club_id')
      .eq('auth_id', user.id)
      .single();

    if (!appUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Search param
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    // Build query — get customers with their latest membership + latest weight
    let query = supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    // Role-based filtering
    if (appUser.role === 'trainer') {
      // Trainers only see their own customers
      query = query.eq('trainer_id', appUser.id);
    } else if (appUser.role === 'manager' && appUser.club_id) {
      // Managers see all customers in their club
      query = query.eq('club_id', appUser.club_id);
    }
    // Owner sees all customers (no filter)

    // Text search on name
    if (search) {
      query = query.ilike('full_name', `%${search}%`);
    }

    const { data: customers, error } = await query;

    if (error) {
      console.error('Customers fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // For each customer, get active membership and latest weight log
    const customerIds = customers.map((c) => c.id);

    // Batch: active memberships
    const { data: memberships } = await supabase
      .from('memberships')
      .select('*')
      .in('customer_id', customerIds.length > 0 ? customerIds : ['__none__'])
      .eq('status', 'active');

    // Batch: latest weight logs (get all, we'll pick latest per customer in JS)
    const { data: weightLogs } = await supabase
      .from('weight_logs')
      .select('*')
      .in('customer_id', customerIds.length > 0 ? customerIds : ['__none__'])
      .order('log_date', { ascending: false });

    // Map memberships and weights to customers
    const membershipMap = new Map<string, any>();
    memberships?.forEach((m) => {
      if (!membershipMap.has(m.customer_id)) {
        membershipMap.set(m.customer_id, m);
      }
    });

    const weightMap = new Map<string, any>();
    weightLogs?.forEach((w) => {
      if (!weightMap.has(w.customer_id)) {
        weightMap.set(w.customer_id, w);
      }
    });

    const enriched = customers.map((c) => {
      const membership = membershipMap.get(c.id);
      const latestWeight = weightMap.get(c.id);

      return {
        ...c,
        membership_status: membership ? 'active' : 'none',
        days_remaining: membership?.days_remaining ?? null,
        last_weight: latestWeight?.weight_kg ?? null,
        weight_change: latestWeight && c.starting_weight
          ? parseFloat((latestWeight.weight_kg - c.starting_weight).toFixed(1))
          : null,
      };
    });

    return NextResponse.json({ customers: enriched });
  } catch (err: any) {
    console.error('Customers API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/customers — create a new customer
export async function POST(request: NextRequest) {
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

    if (!appUser.club_id) {
      return NextResponse.json({ error: 'You are not assigned to a club' }, { status: 400 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.full_name?.trim()) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
    }
    if (!body.starting_weight || body.starting_weight <= 0) {
      return NextResponse.json({ error: 'Starting weight is required' }, { status: 400 });
    }

    const { data: customer, error } = await supabase
      .from('customers')
      .insert({
        full_name: body.full_name.trim(),
        phone: body.phone || null,
        email: body.email || null,
        date_of_birth: body.date_of_birth || null,
        gender: body.gender || null,
        goal: body.goal || null,
        notes: body.notes || null,
        starting_weight: body.starting_weight,
        club_id: appUser.club_id,
        trainer_id: appUser.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Customer insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ customer }, { status: 201 });
  } catch (err: any) {
    console.error('Customer create error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
