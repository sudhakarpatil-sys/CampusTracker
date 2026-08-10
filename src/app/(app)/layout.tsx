import { AppShell } from "@/components/layout/app-shell";
import { ErrorBoundary } from "@/components/shared/error-boundary";

/**
 * Every route under here is gated by middleware to a signed-in user, so
 * there's nothing meaningful to prerender statically — force dynamic
 * rendering so the build doesn't try to run these at build time (which
 * would require live Supabase credentials to be present then).
 */
export const dynamic = "force-dynamic";

/**
 * All authenticated routes render inside this shell. Auth + onboarding
 * gating already happened in src/middleware.ts, so this layout only needs
 * to worry about the visual frame.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AppShell>{children}</AppShell>
    </ErrorBoundary>
  );
}
