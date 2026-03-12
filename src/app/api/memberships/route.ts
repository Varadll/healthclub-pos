import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// POST /api/memberships — create a new membership
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { customer_id, club_id, type } = body;

    if (!customer_id || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (type !== '10-day' && type !== '30-day') {
      return NextResponse.json({ error: 'Invalid membership type' }, { status: 400 });
    }

    const totalDays = type === '10-day' ? 10 : 30;
    const price = type === '10-day' ? 65 : 180;

    // Expire any existing active membership for this customer
    await supabase
      .from('memberships')
      .update({ status: 'expired' })
      .eq('customer_id', customer_id)
      .eq('status', 'active');

    // Create new membership
    // Actual columns: id, customer_id, type, price, start_date, end_date, days_remaining, status, created_at
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + totalDays);

    const startDateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD (date type)
    const endDateStr = endDate.toISOString().split('T')[0]; // YYYY-MM-DD (date type)

    const { data: membership, error } = await supabase
      .from('memberships')
      .insert({
        customer_id,
        type,
        price,
        start_date: startDateStr,
        end_date: endDateStr,
        days_remaining: totalDays,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Membership creation error:', error);
      return NextResponse.json({ error: 'Failed to create membership' }, { status: 500 });
    }

    return NextResponse.json({ membership }, { status: 201 });
  } catch (err: any) {
    console.error('Memberships API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
