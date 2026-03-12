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

      const { data: appUser, error: appUserError } = await supabase
        .from("app_users")
        .select("role")
        .eq("auth_id", authData.user.id)
        .single();

      if (appUserError || !appUser) {
        setError("Account not found in the system. Contact your administrator.");
        setLoading(false);
        return;
      }

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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#C9A84C]/30 mb-6">
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
        <h1
          className="text-3xl tracking-wide text-[#FAFAF8] mb-2"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          HealthPOS
        </h1>
        <p
          className="text-sm text-[#FAFAF8]/50 tracking-widest uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Club Management
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-[#2A2A2C] rounded-2xl p-8 shadow-2xl border border-[#C9A84C]/10">
        <h2
          className="text-xl text-[#FAFAF8] mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Welcome back
        </h2>
        <p
          className="text-sm text-[#FAFAF8]/40 mb-8"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Sign in to your account
        </p>

        {error && (
          <div
            className="mb-6 px-4 py-3 rounded-lg bg-[#C0392B]/10 border border-[#C0392B]/20 text-[#C0392B] text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs text-[#FAFAF8]/50 uppercase tracking-wider mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
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
              className="w-full h-[52px] px-4 rounded-xl bg-[#1C1C1E] border border-[#FAFAF8]/10 text-[#FAFAF8] text-base placeholder:text-[#FAFAF8]/20 focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/30 transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs text-[#FAFAF8]/50 uppercase tracking-wider mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
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
              className="w-full h-[52px] px-4 rounded-xl bg-[#1C1C1E] border border-[#FAFAF8]/10 text-[#FAFAF8] text-base placeholder:text-[#FAFAF8]/20 focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/30 transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full h-[52px] mt-2 rounded-xl text-base font-medium tracking-wide transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: loading
                ? "#C9A84C"
                : "linear-gradient(135deg, #C9A84C 0%, #B8943F 100%)",
              color: "#1C1C1E",
              boxShadow: loading
                ? "none"
                : "0 4px 20px rgba(201, 168, 76, 0.3)",
            }}
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
        </div>
      </div>

      <p
        className="text-center text-xs text-[#FAFAF8]/20 mt-8"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Powered by Herbalife Nutrition
      </p>
    </div>
  );
}
