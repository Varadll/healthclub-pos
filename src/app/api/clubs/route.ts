import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createClient();

    // Get all clubs
    const { data: clubs, error: clubsError } = await supabase
      .from('clubs')
      .select('id, name, address, phone, email, logo_url')
      .order('name');

    if (clubsError) throw clubsError;
    if (!clubs) return NextResponse.json([]);

    // For each club, get counts in parallel
    const clubsWithStats = await Promise.all(
      clubs.map(async (club) => {
        const [trainersRes, customersRes, membershipsRes] = await Promise.all([
          supabase
            .from('app_users')
            .select('id', { count: 'exact', head: true })
            .eq('club_id', club.id)
            .in('role', ['manager', 'trainer']),
          supabase
            .from('customers')
            .select('id', { count: 'exact', head: true })
            .eq('club_id', club.id),
          supabase
            .from('memberships')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'active')
            .in(
              'customer_id',
              // Subquery: get customer IDs for this club
              (await supabase.from('customers').select('id').eq('club_id', club.id)).data?.map(c => c.id) ?? []
            ),
        ]);

        return {
          ...club,
          logoUrl: club.logo_url,
          trainerCount: trainersRes.count ?? 0,
          customerCount: customersRes.count ?? 0,
          activeMembershipCount: membershipsRes.count ?? 0,
        };
      })
    );

    return NextResponse.json(clubsWithStats);
  } catch (error) {
    console.error('Clubs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch clubs' }, { status: 500 });
  }
}
