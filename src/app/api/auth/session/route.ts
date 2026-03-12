import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ user: null, role: null }, { status: 401 });
    }

    // Get role from app_users (FIXED: uses full_name not name)
    const { data: appUser, error: appUserError } = await supabase
      .from("app_users")
      .select("id, full_name, email, role, club_id")
      .eq("auth_id", user.id)
      .single();

    if (appUserError || !appUser) {
      return NextResponse.json(
        { error: "User not found in app_users" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        authId: user.id,
        id: appUser.id,
        fullName: appUser.full_name,
        email: appUser.email,
        role: appUser.role,
        clubId: appUser.club_id,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
