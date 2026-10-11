/***************************************************
 * File: app/robots.ts
 * Purpose: Serve /robots.txt.
 * - Public content is crawlable.
 * - Admin, auth, internal APIs, private review-submission links and
 *   the static design preview of the services page are excluded.
 *   Those routes also carry noindex / auth checks; robots.txt is a
 *   courtesy signal, not a security control.
 ***************************************************/

import type { MetadataRoute } from "next";

// Always generated per request. Without this Next.js prerenders the file at
// build time, when the database is intentionally not connected, and the
// deployed copy would never change again.
export const dynamic = "force-dynamic";
import { getSiteUrl } from "@/lib/seo/siteUrl";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = await getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/auth/",
          "/api/",
          "/review/submission/",
          "/services/static",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
