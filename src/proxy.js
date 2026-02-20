import { NextResponse } from "next/server";
import { auth } from "@/auth";

const locales = ["en", "fr", "de", "es", "pt", "ar", "zh", "hi"];
const defaultLocale = "en";

export async function proxy(request) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  /* ---------------------------------------------
   1️⃣  SKIP STATIC / PUBLIC FILES
  --------------------------------------------- */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/images") ||
    pathname.includes(".") || // catches .png .jpg .svg .css .js
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  /* ---------------------------------------------
   2️⃣  LOCALE HANDLING
  --------------------------------------------- */

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Try to detect previous locale from referer
    const referer = request.headers.get("referer");
    let detectedLocale = defaultLocale;

    if (referer) {
      try {
        const refererUrl = new URL(referer);
        const refererPath = refererUrl.pathname;

        const refererLocale = locales.find(
          (locale) =>
            refererPath.startsWith(`/${locale}/`) ||
            refererPath === `/${locale}`
        );

        if (refererLocale) {
          detectedLocale = refererLocale;
        }
      } catch (err) {
        // ignore parsing errors
      }
    }

    return NextResponse.redirect(
      new URL(`/${detectedLocale}${pathname}`, request.url)
    );
  }

  // Extract locale from URL
  const locale = pathname.split("/")[1];

  // Remove locale for route checks
  const pathWithoutLocale =
    pathname.replace(`/${locale}`, "") || "/";

  /* ---------------------------------------------
   3️⃣  DEFINE ROUTE GROUPS
  --------------------------------------------- */

  const isAppRoute = pathWithoutLocale.startsWith("/app");
  const isAdminRoute = pathWithoutLocale.startsWith("/admin");
  const isAuthRoute = ["/login", "/register", "/reset-password"].includes(
    pathWithoutLocale
  );
  const isTerminatedPage =
    pathWithoutLocale === "/app/account-terminated";

  /* ---------------------------------------------
   4️⃣  LOGGED-IN GLOBAL GUARDS
  --------------------------------------------- */

  if (session) {
    // Account terminated
    if (session.user.terminate) {
      if (!isTerminatedPage) {
        return NextResponse.redirect(
          new URL(`/${locale}/app/account-terminated`, request.url)
        );
      }
      return NextResponse.next();
    }

    if (isTerminatedPage && !session.user.terminate) {
      return NextResponse.redirect(
        new URL(`/${locale}/app`, request.url)
      );
    }

    // Not verified
    if (
      !session.user.verified &&
      isAppRoute &&
      pathWithoutLocale !== "/continue-signup"
    ) {
      return NextResponse.redirect(
        new URL(
          `/${locale}/continue-signup?email=${session.user.email}`,
          request.url
        )
      );
    }

    // Logged-in users shouldn't see auth pages
    if (isAuthRoute) {
      const destination =
        session.user.role === "admin" ? "/admin" : "/app";

      return NextResponse.redirect(
        new URL(`/${locale}${destination}`, request.url)
      );
    }
  }

  /* ---------------------------------------------
   5️⃣  ROUTE PROTECTION
  --------------------------------------------- */

  if (isAppRoute || isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      );
    }

    if (isAdminRoute && session.user.role !== "admin") {
      return NextResponse.redirect(
        new URL(`/${locale}/app`, request.url)
      );
    }
  }

  return NextResponse.next();
}

/* ---------------------------------------------
   6️⃣  MATCHER
--------------------------------------------- */

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
