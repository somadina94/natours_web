import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Next.js 16 network boundary (formerly `middleware`).
 * Keeps defaults minimal; extend for auth redirects or geo headers as needed.
 */
export function proxy(request: NextRequest) {
  void request;
  const res = NextResponse.next();
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
