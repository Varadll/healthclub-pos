import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parallel queries for speed
    const [clubsRes, trainersRes, customersRes, membershipsRes] =
      await Promise.all([
        supabase.from("clubs").select("id", { count: "exact", head: true }),
        supabase
          .from("app_users")
          .select("id", { count: "exact", head: true })
          .in("role", ["trainer", "manager"]),
        supabase
          .from("customers")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("memberships")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
      ]);

    // Get expiring soon (3 days or less remaining)
    const { count: expiringSoon } = await supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .lte("days_remaining", 3);

    return NextResponse.json({
      stats: {
        totalClubs: clubsRes.count || 0,
        totalTrainers: trainersRes.count || 0,
        totalCustomers: customersRes.count || 0,
        activeMemberships: membershipsRes.count || 0,
        expiringSoon: expiringSoon || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
