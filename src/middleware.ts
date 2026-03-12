import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Allow login page for unauthenticated users
  if (pathname === "/login") {
    if (user) {
      // Already logged in — redirect to dashboard based on role
      const { data: appUser } = await supabase
        .from("app_users")
        .select("role")
        .eq("auth_id", user.id)
        .single();

      if (appUser) {
        const redirectMap: Record<string, string> = {
          owner: "/dashboard/owner",
          manager: "/dashboard/manager",
          trainer: "/dashboard/trainer",
        };
        const redirectPath = redirectMap[appUser.role] || "/dashboard/trainer";
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }
    return supabaseResponse;
  }

  // Protect all dashboard routes
  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Root path — redirect based on role
  if (pathname === "/" && user) {
    const { data: appUser } = await supabase
      .from("app_users")
      .select("role")
      .eq("auth_id", user.id)
      .single();

    if (appUser) {
      const redirectMap: Record<string, string> = {
        owner: "/dashboard/owner",
        manager: "/dashboard/manager",
        trainer: "/dashboard/trainer",
      };
      const redirectPath = redirectMap[appUser.role] || "/dashboard/trainer";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
