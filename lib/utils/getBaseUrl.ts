import { headers } from "next/headers";

/**
 * Get absolute base URL safely (server-only)
 * Works in:
 * - Local
 * - Production
 * - VPS + Nginx
 * - HTTPS / HTTP
 * - Without NEXT_PUBLIC_BASE_URL
 */
export async function getBaseUrl(): Promise<string> {
  const h = await headers();

  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, "");

  if (!host) {
    throw new Error("Unable to determine base URL");
  }

  return `${proto}://${host}`;
}
