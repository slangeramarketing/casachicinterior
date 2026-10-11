/***************************************************
 * File: modules/seo/__tests__/siteUrl.test.ts
 * Purpose: PUBLIC_SITE_URL validation (lib/seo/siteUrl.ts). A bad value
 * must fall back to the request host instead of leaking into canonicals
 * or crashing the root layout.
 ***************************************************/

import { describe, it, expect } from "vitest";
import { parseSiteUrl } from "@/lib/seo/siteUrl";

const prod = { production: true };
const dev = { production: false };

describe("parseSiteUrl", () => {
  it("accepts a valid https origin and strips path and trailing slash", () => {
    expect(parseSiteUrl("https://casachicinterior.com", prod)).toBe("https://casachicinterior.com");
    expect(parseSiteUrl(" https://casachicinterior.com/ ", prod)).toBe("https://casachicinterior.com");
    expect(parseSiteUrl("https://casachicinterior.com/some/path", prod)).toBe("https://casachicinterior.com");
  });

  it("returns null for empty or scheme-less values instead of throwing", () => {
    expect(parseSiteUrl(undefined, prod)).toBeNull();
    expect(parseSiteUrl("", prod)).toBeNull();
    expect(parseSiteUrl("casachicinterior.com", prod)).toBeNull();
    expect(parseSiteUrl("www.casachicinterior.com/", prod)).toBeNull();
    expect(parseSiteUrl("ftp://casachicinterior.com", dev)).toBeNull();
  });

  it("rejects localhost and plain http in production", () => {
    expect(parseSiteUrl("http://localhost:3000", prod)).toBeNull();
    expect(parseSiteUrl("https://localhost:3000", prod)).toBeNull();
    expect(parseSiteUrl("https://127.0.0.1", prod)).toBeNull();
    expect(parseSiteUrl("http://casachicinterior.com", prod)).toBeNull();
  });

  it("allows localhost and http during development", () => {
    expect(parseSiteUrl("http://localhost:3000", dev)).toBe("http://localhost:3000");
    expect(parseSiteUrl("http://localhost:3000/", dev)).toBe("http://localhost:3000");
  });
});
