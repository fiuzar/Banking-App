import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function proxy(request) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Define route groups
  const isAppRoute = pathname.startsWith("/app");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = ["/login", "/register", "/reset-password"].includes(pathname);
  const isTerminatedPage = pathname === "/app/account-terminated";

  // 1. PUBLIC ROUTES / ASSETS
  // Allow system files and public images to pass through without checks
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. LOGGED-IN GLOBAL GUARDS
  if (session) {
    
    // GUARD A: Account Termination (The "Nuclear" Option)
    // If terminated, they can ONLY see the terminated page.
    if (session.user.terminate) {
      if (!isTerminatedPage) {
        return NextResponse.redirect(new URL("/app/account-terminated", request.url));
      }
      return NextResponse.next(); // Stay on termination page
    }

    // GUARD B: Anti-Loop for Terminated Page
    // If NOT terminated, don't let them stay on the terminated page
    if (isTerminatedPage && !session.user.terminate) {
        return NextResponse.redirect(new URL("/app", request.url));
    }

    // GUARD C: Email Verification
    // Redirect unverified users to the signup completion page
    if (!session.user.verified && isAppRoute && pathname !== "/continue-signup") {
      return NextResponse.redirect(
        new URL(`/continue-signup?email=${session.user.email}`, request.url)
      );
    }

    // GUARD D: Auth Pages Access
    // If logged in, don't allow access to Login/Register
    if (isAuthRoute) {
      const destination = session.user.role === "admin" ? "/admin" : "/app";
      return NextResponse.next(); // Usually handled by redirect below
    }
  }

  // 3. ROUTE PROTECTION (APP & ADMIN)
  if (isAppRoute || isAdminRoute) {
    // If no session, go to login
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Strict Admin Role Check
    if (isAdminRoute && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }

  // 4. FINAL REDIRECT FOR LOGGED-IN USERS ON AUTH PAGES
  if (isAuthRoute && session) {
     const destination = session.user.role === "admin" ? "/admin" : "/app";
     return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

// Next.js Middleware Matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};