import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// POST /api/visits — log a visit (deducts 1 day from membership)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { customer_id, membership_id, club_id, trainer_id } = body;

    if (!customer_id || !membership_id || !club_id || !trainer_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify membership exists and is active
    const { data: membership, error: memError } = await supabase
      .from('memberships')
      .select('*')
      .eq('id', membership_id)
      .eq('status', 'active')
      .single();

    if (memError || !membership) {
      return NextResponse.json({ error: 'No active membership found' }, { status: 400 });
    }

    if (membership.days_remaining <= 0) {
      return NextResponse.json({ error: 'Membership has no days remaining' }, { status: 400 });
    }

    // Check if already visited today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingVisit } = await supabase
      .from('visits')
      .select('id')
      .eq('customer_id', customer_id)
      .eq('membership_id', membership_id)
      .gte('visited_at', `${today}T00:00:00`)
      .lte('visited_at', `${today}T23:59:59`)
      .limit(1)
      .single();

    if (existingVisit) {
      return NextResponse.json({ error: 'Already checked in today' }, { status: 400 });
    }

    // Insert visit
    const { error: visitError } = await supabase
      .from('visits')
      .insert({
        customer_id,
        membership_id,
        club_id,
        trainer_id,
      });

    if (visitError) {
      console.error('Visit insert error:', visitError);
      return NextResponse.json({ error: 'Failed to log visit' }, { status: 500 });
    }

    // Deduct 1 day
    const newDaysRemaining = membership.days_remaining - 1;
    const newStatus = newDaysRemaining <= 0 ? 'expired' : 'active';

    const { error: updateError } = await supabase
      .from('memberships')
      .update({
        days_remaining: newDaysRemaining,
        status: newStatus,
      })
      .eq('id', membership_id);

    if (updateError) {
      console.error('Membership update error:', updateError);
      return NextResponse.json({ error: 'Visit logged but failed to update days' }, { status: 500 });
    }

    return NextResponse.json({
      visit: { customer_id, membership_id, club_id, trainer_id },
      days_remaining: newDaysRemaining,
      status: newStatus,
    }, { status: 201 });
  } catch (err: any) {
    console.error('Visits API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
