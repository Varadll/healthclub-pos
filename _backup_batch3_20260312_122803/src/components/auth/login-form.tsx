"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Get the user's role from app_users (FIXED: uses auth_id + full_name)
      const { data: appUser, error: appUserError } = await supabase
        .from("app_users")
        .select("role, full_name")
        .eq("auth_id", authData.user.id)
        .single();

      if (appUserError || !appUser) {
        setError("Account not found in the system. Contact your administrator.");
        setLoading(false);
        return;
      }

      // 3. Redirect based on role
      const redirectMap: Record<string, string> = {
        owner: "/dashboard/owner",
        manager: "/dashboard/manager",
        trainer: "/dashboard/trainer",
      };

      const redirectPath = redirectMap[appUser.role] || "/dashboard/trainer";
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo / Brand */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-gold/30 mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <h1 className="font-display text-3xl tracking-wide text-surface mb-2">
          HealthPOS
        </h1>
        <p className="font-body text-sm text-surface/50 tracking-widest uppercase">
          Club Management
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-charcoal-soft rounded-2xl p-8 shadow-2xl border border-gold/10">
        <h2 className="font-display text-xl text-surface mb-1">
          Welcome back
        </h2>
        <p className="font-body text-sm text-surface/40 mb-8">
          Sign in to your account
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs text-surface/50 uppercase tracking-wider mb-2 font-body"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full h-[52px] px-4 rounded-xl bg-charcoal border border-surface/10 text-surface text-base font-body placeholder:text-surface/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all duration-200"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs text-surface/50 uppercase tracking-wider mb-2 font-body"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full h-[52px] px-4 rounded-xl bg-charcoal border border-surface/10 text-surface text-base font-body placeholder:text-surface/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full h-[52px] mt-2 rounded-xl text-base font-medium font-body tracking-wide transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gold hover:bg-gold-light text-charcoal shadow-luxury"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-surface/20 mt-8 font-body">
        Powered by Herbalife Nutrition
      </p>
    </div>
  );
}
