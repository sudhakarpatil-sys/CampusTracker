import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/auth/callback", "/offline"];
// Routes an already-authenticated user shouldn't linger on — sent to
// their dashboard instead. "/" is included so reopening the site after
// closing the tab lands you back in the app instead of the marketing
// page, since a valid session cookie means you were never logged out.
const AUTH_ROUTES = ["/", "/login", "/signup", "/forgot-password"];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function middleware(request: NextRequest) {
  const { response, user, onboardingCompleted } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // API routes (added in Phase 3A) are called via fetch(), not full-page
  // navigation — they must return JSON, never a redirect. Each route
  // handler does its own auth check via supabase.auth.getUser() and
  // responds with a proper 401, so the page-redirect logic below (which
  // assumes an HTML navigation) doesn't apply here. Session cookies are
  // still refreshed by the updateSession() call above.
  if (pathname.startsWith("/api/")) {
    return response;
  }

  // Unauthenticated users trying to reach a protected route are always
  // sent back to the landing page, per the auth spec.
  if (!user && !isPublicRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("auth", "required");
    return NextResponse.redirect(url);
  }

  // Authenticated users shouldn't linger on login/signup screens.
  if (user && AUTH_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // First-login users are funneled into onboarding before anything else.
  if (user && onboardingCompleted === false && !isPublicRoute(pathname) && pathname !== "/onboarding") {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Once onboarding is done, don't let the user linger on that screen.
  if (user && onboardingCompleted === true && pathname === "/onboarding") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and Next internals so the
     * session cookie is refreshed on every navigation.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
