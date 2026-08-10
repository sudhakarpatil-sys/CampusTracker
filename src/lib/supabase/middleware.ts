import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Refreshes the Supabase auth session on every request and returns both
 * the (possibly updated) response and the current user, so the caller
 * can make redirect decisions in a single place (see /src/middleware.ts).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let onboardingCompleted: boolean | null = null;
  let userRole: string | null = null;

  if (user) {
    const metaOnboarding = user.user_metadata?.onboarding_completed;
    const metaRole = user.user_metadata?.role;

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile && typeof profile.onboarding_completed === "boolean") {
      onboardingCompleted = profile.onboarding_completed;
      userRole = profile.role || (metaRole as string) || "student";
    } else if (metaOnboarding !== undefined) {
      onboardingCompleted = Boolean(metaOnboarding);
      userRole = (metaRole as string) || "student";
    } else {
      onboardingCompleted = false;
      userRole = "student";
    }
  }

  return { response, user, onboardingCompleted, userRole };
}
