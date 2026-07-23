import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/auth/callback", "/offline"];
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function middleware(request: NextRequest) {
  const { response, user, onboardingCompleted } = await updateSession(request);
  const { pathname } = request.nextUrl;

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
