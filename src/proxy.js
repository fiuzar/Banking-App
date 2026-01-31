import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function proxy(request) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAppRoute = pathname.startsWith("/app");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = ["/login", "/register"].includes(pathname);

  // 1. Secure /app and /admin routes
  if (isAppRoute || isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Force OTP if not verified
    if (!session.user.verified && pathname !== "/continue-signup") {
      return NextResponse.redirect(
        new URL(`/continue-signup?email=${session.user.email}`, request.url)
      );
    }

    // 2. Strict Admin Role Check
    if (isAdminRoute && session.user.role !== "admin") {
      // Redirect regular users with savings/checking accounts away from admin tools
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }

  // 3. Redirect logged-in users away from Login/Register
  if (isAuthRoute && session) {
    const destination = session.user.role === "admin" ? "/admin" : "/app";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

// Next.js 16 still uses the config object for route matching
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};