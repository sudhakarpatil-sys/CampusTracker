import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/auth/callback", "/offline", "/mobile"];
// Routes an already-authenticated user shouldn't linger on — sent to
// their dashboard instead. "/" is included so reopening the site after
// closing the tab lands you back in the app instead of the marketing
// page, since a valid session cookie means you were never logged out.
const AUTH_ROUTES = ["/", "/login", "/signup", "/forgot-password"];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

// ─────────────────────────────────────────────────────────────────────────
// Security headers applied to every response.
// ─────────────────────────────────────────────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  // Prevent MIME-type sniffing (e.g., treating uploads as HTML).
  "X-Content-Type-Options": "nosniff",
  // Block clickjacking by forbidding iframe embedding except same-origin.
  "X-Frame-Options": "SAMEORIGIN",
  // Instruct browsers to prefer HTTPS for future requests (1 year).
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  // Control referrer leakage — send origin only on cross-origin requests.
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Disable browser features not used by CampusTracker.
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
};

/**
 * Content Security Policy — allows:
 *   - self for scripts, styles, images, fonts, connections
 *   - Supabase project for API + storage
 *   - Google Fonts for font files
 *   - inline styles (required by Tailwind's style injection)
 *   - unsafe-eval in dev only (Next.js HMR)
 *   - data: for small inline SVGs / base64 images
 */
function buildCSP(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const isDev = process.env.NODE_ENV === "development";

  const directives = [
    `default-src 'self'`,
    `script-src 'self'${isDev ? " 'unsafe-eval'" : ""} 'unsafe-inline'`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: blob: ${supabaseUrl} https://*.supabase.co`,
    `font-src 'self' https://fonts.gstatic.com`,
    `connect-src 'self' ${supabaseUrl} https://*.supabase.co wss://*.supabase.co${isDev ? " ws://localhost:*" : ""}`,
    `frame-ancestors 'self'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
  ];

  return directives.join("; ");
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  response.headers.set("Content-Security-Policy", buildCSP());
  return response;
}

export async function middleware(request: NextRequest) {
  const { response, user, onboardingCompleted, userRole } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // API routes (added in Phase 3A) are called via fetch(), not full-page
  // navigation — they must return JSON, never a redirect. Each route
  // handler does its own auth check via supabase.auth.getUser() and
  // responds with a proper 401, so the page-redirect logic below (which
  // assumes an HTML navigation) doesn't apply here. Session cookies are
  // still refreshed by the updateSession() call above.
  if (pathname.startsWith("/api/")) {
    return applySecurityHeaders(response);
  }

  // Unauthenticated users trying to reach a protected route are always
  // sent back to the landing page, per the auth spec.
  if (!user && !isPublicRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("auth", "required");
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  // Authenticated users shouldn't linger on login/signup screens.
  if (user && AUTH_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  // First-login users are funneled into onboarding before anything else.
  if (user && onboardingCompleted === false && !isPublicRoute(pathname) && pathname !== "/onboarding") {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    url.search = "";
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  // Once onboarding is done, don't let the user linger on that screen.
  if (user && onboardingCompleted === true && pathname === "/onboarding") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Role-Based Access Control (RBAC) Route Guards (Phase 4C)
  // ─────────────────────────────────────────────────────────────────────────
  if (user && onboardingCompleted === true) {
    const effectiveRole = userRole || "student";

    // Admin Console Protection — strictly requires role === 'admin'
    if (pathname.startsWith("/admin") && effectiveRole !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.searchParams.set("error", "unauthorized_admin");
      return applySecurityHeaders(NextResponse.redirect(url));
    }

    // Faculty Console Protection — requires role === 'faculty' or 'admin'
    if (pathname.startsWith("/faculty") && effectiveRole !== "faculty" && effectiveRole !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.searchParams.set("error", "unauthorized_faculty");
      return applySecurityHeaders(NextResponse.redirect(url));
    }
  }

  return applySecurityHeaders(response);
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
