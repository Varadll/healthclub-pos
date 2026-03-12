import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(
  request: NextRequest,
  { params }: { params: { clubId: string } }
) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clubId = params.clubId;

    // Get club details
    const { data: club, error: clubError } = await supabase
      .from("clubs")
      .select("*")
      .eq("id", clubId)
      .single();

    if (clubError || !club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    // Get trainers for this club
    const { data: trainers } = await supabase
      .from("app_users")
      .select("id, full_name, email, role")
      .eq("club_id", clubId)
      .in("role", ["trainer", "manager"])
      .order("full_name");

    // Get customers for this club
    const { data: customers } = await supabase
      .from("customers")
      .select("id, full_name, email, phone, trainer_id")
      .eq("club_id", clubId)
      .order("full_name");

    // Get active memberships for this club
    const { data: memberships } = await supabase
      .from("memberships")
      .select("id, customer_id, type, days_remaining, status")
      .eq("club_id", clubId)
      .eq("status", "active");

    return NextResponse.json({
      club,
      trainers: trainers || [],
      customers: customers || [],
      memberships: memberships || [],
    });
  } catch (error) {
    console.error("Club detail API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
