"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database.types";

/**
 * Client-side hook exposing the current auth user + profile row, kept in
 * sync with Supabase auth state changes (login, logout, token refresh).
 */
export function useUser() {
  const supabase = React.useMemo(() => createClient(), []);
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadProfile = React.useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
        if (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to load profile:", error.message);
          return;
        }
        setProfile(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Profile load error:", err);
      }
    },
    [supabase]
  );

  React.useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(data.user);
        if (data.user) {
          await loadProfile(data.user.id);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Auth init error:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  return { user, profile, isLoading, refreshProfile: () => user && loadProfile(user.id) };
}
