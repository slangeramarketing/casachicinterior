/* ---------------------------------------
   middleware.ts
---------------------------------------- */

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/modules/auth/auth.middleware";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  /* ===============================
     CASE 1: User tries to access LOGIN
     =============================== */
  if (pathname.startsWith("/auth/login")) {
    if (token) {
      const result = authorize(token);

      if (result.ok) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/home";
        return NextResponse.redirect(url);
      }
    }

    // Not logged in → allow login page
    return NextResponse.next();
  }

  /* ===============================
     CASE 2: Admin Routes Protection
     =============================== */
  if (pathname.startsWith("/admin")) {
    const result = authorize(token, ["admin", "super_admin"]);

    if (!result.ok && result.error === "UNAUTHORIZED") {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    if (!result.ok && result.error === "FORBIDDEN") {
      const url = req.nextUrl.clone();
      url.pathname = "/403";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/login",
  ],
};
