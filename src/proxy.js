import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function proxy(request) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAppRoute = pathname.startsWith("/app");
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isVerifyRoute = pathname === "/continue-signup";

  // 1. Protect /app routes
  if (isAppRoute) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    
    // If logged in but not verified, force them to OTP page
    if (session.user && !session.user.verified) {
      return NextResponse.redirect(new URL(`/continue-signup?email=${session.user.email}`, request.url));
    }
  }

  // 2. Redirect logged-in users away from Login (but NOT Register)
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};