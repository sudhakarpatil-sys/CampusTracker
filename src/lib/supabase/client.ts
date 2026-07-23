"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * Browser Supabase client. Use inside Client Components and hooks.
 * Reads publishable env vars only — never put the service role key here.
 *
 * This is a module-level singleton on purpose: nearly every data hook in
 * this app (useUser, useSupabaseCollection, useNotifications, ...) calls
 * createClient() independently. If each call minted a fresh
 * createBrowserClient(), a single page with a handful of widgets could
 * spin up a dozen separate GoTrueClient instances — each with its own
 * auth listener and token-refresh timer — which is both wasteful and the
 * source of Supabase's "Multiple GoTrueClient instances detected" warning.
 * Reusing one instance per browser tab avoids all of that.
 */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
}
