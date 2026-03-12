import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: { headers: req.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
          });
          res = NextResponse.next({
            request: { headers: req.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  if (pathname === "/login") {
    if (session) {
      const { data: appUser } = await supabase
        .from("app_users")
        .select("role")
        .eq("auth_id", session.user.id)
        .single();

      if (appUser) {
        const redirectMap: Record<string, string> = {
          owner: "/dashboard/owner",
          manager: "/dashboard/manager",
          trainer: "/dashboard/trainer",
        };
        const redirectPath = redirectMap[appUser.role] || "/dashboard/trainer";
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }
    return res;
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/") {
    const { data: appUser } = await supabase
      .from("app_users")
      .select("role")
      .eq("auth_id", session.user.id)
      .single();

    if (appUser) {
      const redirectMap: Record<string, string> = {
        owner: "/dashboard/owner",
        manager: "/dashboard/manager",
        trainer: "/dashboard/trainer",
      };
      const redirectPath = redirectMap[appUser.role] || "/dashboard/trainer";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
