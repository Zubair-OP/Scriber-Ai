import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import {
  applySecurityHeaders,
  checkRateLimit,
  getClientIdentifier,
  getRateLimitRule,
  isProtectedApiPath,
} from "@/lib/request-security";

// Page routes that require an authenticated session. A logged-out visitor hitting
// any of these is bounced to /login. Publicly shared resumes are excluded below.
const PROTECTED_PAGE_PREFIXES = ["/dashboard", "/resume"];

// Publicly reachable resume routes (shared read-only links) that must stay open
// even without a session, despite matching the /resume prefix above.
const PUBLIC_PAGE_PREFIXES = ["/resume/share"];

function isProtectedPagePath(pathname: string): boolean {
  if (PUBLIC_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false;
  }
  return PROTECTED_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  applySecurityHeaders(response.headers, pathname.startsWith("/api"));

  if (!pathname.startsWith("/api")) {
    // Edge runtime can't run jsonwebtoken, so gate pages on cookie presence only.
    // getCurrentUser() still fully verifies the JWT on every protected data call.
    if (isProtectedPagePath(pathname) && !request.cookies.get("token")?.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  if (!isProtectedApiPath(pathname)) {
    return response;
  }

  const rule = getRateLimitRule(pathname);

  if (!rule) {
    return response;
  }

  const clientId = getClientIdentifier(request);
  const limitKey = `${pathname}:${clientId}`;
  const result = checkRateLimit(limitKey, rule);

  response.headers.set("X-RateLimit-Limit", String(rule.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));

  if (!result.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
    const limitedResponse = NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Too many requests",
      },
      { status: 429 }
    );

    applySecurityHeaders(limitedResponse.headers, true);
    limitedResponse.headers.set("Retry-After", String(retryAfterSeconds));
    limitedResponse.headers.set("X-RateLimit-Limit", String(rule.limit));
    limitedResponse.headers.set("X-RateLimit-Remaining", "0");
    limitedResponse.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));

    return limitedResponse;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
