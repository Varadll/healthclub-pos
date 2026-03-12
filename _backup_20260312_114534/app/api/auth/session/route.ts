import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ user: null, role: null }, { status: 401 });
    }

    const { data: appUser, error: appUserError } = await supabase
      .from("app_users")
      .select("id, full_name, email, role, club_id")
      .eq("auth_id", session.user.id)
      .single();

    if (appUserError || !appUser) {
      return NextResponse.json(
        { error: "User not found in app_users" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        authId: session.user.id,
        id: appUser.id,
        name: appUser.full_name,
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
