/***************************************************
 * File: lib/seo/siteUrl.ts
 * Purpose:
 * - Resolve the canonical public origin used for canonical tags,
 *   Open Graph URLs, JSON-LD, the sitemap and robots.txt.
 *
 * Order of precedence:
 * 1. PUBLIC_SITE_URL, but only when it is a valid absolute URL. In
 *    production it must also be https and must not point at localhost,
 *    so a development value copied into a server .env can never leak
 *    into canonical tags or the sitemap.
 * 2. The incoming request host (x-forwarded-host / host). This is what
 *    the site used before this module existed and is correct behind
 *    nginx; www and the old domains are redirected before rendering.
 *
 * NEXT_PUBLIC_BASE_URL is deliberately NOT consulted: its value differs
 * per environment, and the previous code only used it when a request
 * had no Host header at all.
 ***************************************************/

import { getBaseUrl } from "@/lib/utils/getBaseUrl";

function normalize(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]", "::1"]);

/**
 * Validate a configured site URL and reduce it to its origin
 * (e.g. "https://casachicinterior.com": no path, no trailing slash).
 * Returns null for anything unusable so callers fall back safely
 * instead of throwing (a scheme-less value used to crash new URL()).
 */
export function parseSiteUrl(
  value: string | undefined | null,
  opts: { production: boolean }
): string | null {
  const raw = (value ?? "").trim();
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  if (opts.production) {
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:") return null;
    if (LOCAL_HOSTNAMES.has(host) || host.endsWith(".localhost")) return null;
  }

  return url.origin;
}

/** Env-only variant for places that must not read request headers. */
export function getConfiguredSiteUrl(): string | null {
  return parseSiteUrl(process.env.PUBLIC_SITE_URL, {
    production: process.env.NODE_ENV === "production",
  });
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
