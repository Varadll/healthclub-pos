"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export interface CurrentUser {
  authId: string;
  id: string;
  fullName: string;
  email: string;
  role: "owner" | "manager" | "trainer";
  clubId: string | null;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        const { data: appUser, error } = await supabase
          .from("app_users")
          .select("id, full_name, email, role, club_id")
          .eq("auth_id", authUser.id)
          .single();

        if (error || !appUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser({
          authId: authUser.id,
          id: appUser.id,
          fullName: appUser.full_name,
          email: appUser.email,
          role: appUser.role,
          clubId: appUser.club_id,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        router.push("/login");
      } else {
        getUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return { user, loading, signOut };
}
