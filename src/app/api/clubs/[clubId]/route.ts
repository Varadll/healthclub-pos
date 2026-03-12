import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: { clubId: string } }
) {
  try {
    const supabase = createClient();
    const { clubId } = params;

    // Get club info
    const { data: club, error: clubError } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', clubId)
      .single();

    if (clubError || !club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Get trainers and customers in parallel
    const [trainersRes, customersRes] = await Promise.all([
      supabase
        .from('app_users')
        .select('id, full_name, email, role')
        .eq('club_id', clubId)
        .in('role', ['manager', 'trainer'])
        .order('full_name'),
      supabase
        .from('customers')
        .select(`
          id, full_name, phone, email, gender, start_date, goal,
          memberships (id, type, status, days_remaining, start_date, end_date)
        `)
        .eq('club_id', clubId)
        .order('full_name'),
    ]);

    return NextResponse.json({
      ...club,
      logoUrl: club.logo_url,
      trainers: trainersRes.data ?? [],
      customers: (customersRes.data ?? []).map((c: any) => {
        // Find active membership
        const activeMembership = c.memberships?.find((m: any) => m.status === 'active') ?? null;
        return {
          id: c.id,
          fullName: c.full_name,
          phone: c.phone,
          email: c.email,
          gender: c.gender,
          startDate: c.start_date,
          goal: c.goal,
          activeMembership: activeMembership
            ? {
                type: activeMembership.type,
                daysRemaining: activeMembership.days_remaining,
                status: activeMembership.status,
              }
            : null,
        };
      }),
    });
  } catch (error) {
    console.error('Club detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch club details' }, { status: 500 });
  }
}
