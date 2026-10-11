/***************************************************
 * File: lib/seo/siteUrl.ts
 * Purpose:
 * - Resolve the canonical public origin used for canonical tags,
 *   Open Graph URLs, the sitemap and robots.txt.
 *
 * Order of precedence:
 * 1. PUBLIC_SITE_URL   (server-only, set per environment)
 * 2. NEXT_PUBLIC_BASE_URL
 * 3. The incoming request host (local development fallback)
 *
 * Why not always the request host: the live site answers on more
 * than one hostname (www and bare domain). Canonicals must always
 * name the preferred one, regardless of which host served the page.
 ***************************************************/

import { getBaseUrl } from "@/lib/utils/getBaseUrl";

function normalize(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/** Env-only variant for places that must not read request headers. */
export function getConfiguredSiteUrl(): string | null {
  const configured =
    process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
  return configured ? normalize(configured) : null;
}

export async function getSiteUrl(): Promise<string> {
  const configured = getConfiguredSiteUrl();
  if (configured) return configured;
  return normalize(await getBaseUrl());
}

/** Join a route path onto the site origin without double slashes. */
export function absoluteUrl(siteUrl: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${normalize(siteUrl)}${path === "/" ? "" : path}` || siteUrl;
}
