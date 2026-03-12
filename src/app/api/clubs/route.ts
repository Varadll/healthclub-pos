import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createClient();

    // Verify auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all clubs
    const { data: clubs, error: clubsError } = await supabase
      .from("clubs")
      .select("*")
      .order("name");

    if (clubsError) {
      console.error("Error fetching clubs:", clubsError);
      return NextResponse.json(
        { error: "Failed to fetch clubs" },
        { status: 500 }
      );
    }

    // Get trainer counts per club
    const { data: trainers } = await supabase
      .from("app_users")
      .select("club_id")
      .in("role", ["trainer", "manager"]);

    // Get customer counts per club
    const { data: customers } = await supabase
      .from("customers")
      .select("club_id");

    // Get active membership counts per club
    const { data: memberships } = await supabase
      .from("memberships")
      .select("club_id")
      .eq("status", "active");

    // Build stats per club
    const clubsWithStats = (clubs || []).map((club) => ({
      ...club,
      trainer_count: (trainers || []).filter((t) => t.club_id === club.id).length,
      customer_count: (customers || []).filter((c) => c.club_id === club.id).length,
      active_membership_count: (memberships || []).filter(
        (m) => m.club_id === club.id
      ).length,
    }));

    return NextResponse.json({ clubs: clubsWithStats });
  } catch (error) {
    console.error("Clubs API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
