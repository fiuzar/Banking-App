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
    pathname.includes(".") || 
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  /* ---------------------------------------------
   2️⃣  LOCALE HANDLING (Cookie -> Geo -> Browser)
  --------------------------------------------- */

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // A. Check for existing cookie (Returning users/Manually set)
    let detectedLocale = request.cookies.get("NEXT_LOCALE")?.value;

    // B. If no cookie, check Geolocation (New users)
    if (!detectedLocale) {
      // Vercel/Cloudflare headers for country detection
      const country = request.headers.get("x-vercel-ip-country") || 
                      request.headers.get("cf-ipcountry") || "";
      
      const geoMap = {
        'FR': 'fr', 'DE': 'de', 'ES': 'es', 'MX': 'es', 'AR': 'es',
        'BR': 'pt', 'PT': 'pt', 'CN': 'zh', 'IN': 'hi', 'SA': 'ar', 'AE': 'ar'
      };
      
      detectedLocale = geoMap[country];
    }

    // C. If no Geo match, check Browser Language
    if (!detectedLocale) {
      const acceptLang = request.headers.get("accept-language");
      const browserLang = acceptLang?.split(",")[0].split("-")[0];
      if (locales.includes(browserLang)) {
        detectedLocale = browserLang;
      }
    }

    // D. Fallback to Referer or Default
    if (!detectedLocale) {
      const referer = request.headers.get("referer");
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          const refererLocale = locales.find(l => refererUrl.pathname.startsWith(`/${l}`));
          detectedLocale = refererLocale;
        } catch (e) {}
      }
    }

    const finalLocale = detectedLocale || defaultLocale;

    // Execute Redirect
    const response = NextResponse.redirect(
      new URL(`/${finalLocale}${pathname}`, request.url)
    );

    // Persist the locale in a cookie so we don't guess again
    response.cookies.set("NEXT_LOCALE", finalLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 Days
    });

    return response;
  }

  // Extract locale from URL for use in subsequent routes
  const locale = pathname.split("/")[1];
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  /* ---------------------------------------------
   3️⃣  DEFINE ROUTE GROUPS
  --------------------------------------------- */
  const isAppRoute = pathWithoutLocale.startsWith("/app");
  const isAdminRoute = pathWithoutLocale.startsWith("/admin");
  const isAuthRoute = ["/login", "/register", "/reset-password"].includes(pathWithoutLocale);
  const isTerminatedPage = pathWithoutLocale === "/app/account-terminated";

  /* ---------------------------------------------
   4️⃣  LOGGED-IN GLOBAL GUARDS
  --------------------------------------------- */
  if (session) {
    // 1. Account terminated check
    if (session.user.terminate) {
      if (!isTerminatedPage) {
        return NextResponse.redirect(
          new URL(`/${locale}/app/account-terminated`, request.url)
        );
      }
      return NextResponse.next();
    }

    if (isTerminatedPage && !session.user.terminate) {
      return NextResponse.redirect(new URL(`/${locale}/app`, request.url));
    }

    // 2. Verification/Signup completion check
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

    // 3. Auth page bypass (don't show login to logged in users)
    if (isAuthRoute) {
      const destination = session.user.role === "admin" ? "/admin" : "/app";
      return NextResponse.redirect(
        new URL(`/${locale}${destination}`, request.url)
      );
    }
  }

  /* ---------------------------------------------
   5️⃣  ROUTE PROTECTION (Unauthorized access)
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

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};