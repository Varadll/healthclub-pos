"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export interface CurrentUser {
  authId: string;
  id: string;
  name: string;
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
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }

        const { data: appUser, error } = await supabase
          .from("app_users")
          .select("id, full_name, email, role, club_id")
          .eq("auth_id", session.user.id)
          .single();

        if (error || !appUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser({
          authId: session.user.id,
          id: appUser.id,
          name: appUser.full_name,
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
