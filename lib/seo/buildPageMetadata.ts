/***************************************************
 * File: lib/seo/buildPageMetadata.ts
 * Purpose:
 * - Pure function that merges a page's hardcoded defaults with the
 *   dashboard-managed SEO record (if any) into a Next.js Metadata
 *   object. Used by every managed public page's generateMetadata().
 *
 * Fallback rules (Phase 5 of the brief):
 * - No record / record not published / lookup failed -> defaults.
 * - Each field falls back individually, so a record with only a
 *   title still keeps the page's default description.
 * - Canonical is always absolute and always derived from the
 *   configured site URL unless an explicit override is stored.
 *
 * Restrictions:
 * - No I/O. No Next.js request APIs. Must stay unit-testable.
 ***************************************************/

import type { Metadata } from "next";
import { absoluteUrl } from "./siteUrl";
import { siteConfig } from "./siteConfig";

export interface PageMetadataDefaults {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

/** The subset of PageSeoResponseDTO the builder needs. */
export interface PageSeoLike {
  title?: string;
  description?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  metaRobots?: string;
  status?: string;
}

export interface RobotsDirective {
  index: boolean;
  follow: boolean;
}

export function parseMetaRobots(value?: string | null): RobotsDirective {
  const tokens = (value ?? "")
    .toLowerCase()
    .split(",")
    .map((t) => t.trim());

  return {
    index: !tokens.includes("noindex"),
    follow: !tokens.includes("nofollow"),
  };
}

function cleanList(values: Array<string | undefined | null> | undefined): string[] {
  if (!values) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const v = (raw ?? "").trim();
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

export function buildPageMetadata(params: {
  route: string;
  siteUrl: string;
  defaults: PageMetadataDefaults;
  seo?: PageSeoLike | null;
}): Metadata {
  const { route, siteUrl, defaults } = params;

  // Only published records may influence the public site.
  const seo =
    params.seo && (params.seo.status === undefined || params.seo.status === "published")
      ? params.seo
      : null;

  const title = seo?.title?.trim() || defaults.title;
  const description = seo?.description?.trim() || defaults.description;

  const keywords = seo
    ? cleanList([seo.primaryKeyword, ...(seo.secondaryKeywords ?? [])])
    : cleanList(defaults.keywords);

  const canonical = seo?.canonicalUrl?.trim() || absoluteUrl(siteUrl, route);

  const robots = parseMetaRobots(seo?.metaRobots ?? "index, follow");

  const ogImagePath = seo?.ogImage?.trim() || defaults.ogImage || siteConfig.defaultOgImagePath;
  const ogImage = absoluteUrl(siteUrl, ogImagePath);

  return {
    title,
    description,
    ...(keywords.length ? { keywords } : {}),
    alternates: { canonical },
    robots: {
      index: robots.index,
      follow: robots.follow,
      googleBot: {
        index: robots.index,
        follow: robots.follow,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_IN",
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
