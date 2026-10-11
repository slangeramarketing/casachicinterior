/***************************************************
 * File: modules/seo/__tests__/buildPageMetadata.test.ts
 *
 * Purpose:
 * - Metadata merging rules used by every managed public page
 *   (lib/seo/buildPageMetadata.ts) and the sitemap/robots helpers.
 ***************************************************/

import { describe, it, expect } from "vitest";
import { buildPageMetadata, parseMetaRobots } from "@/lib/seo/buildPageMetadata";
import { absoluteUrl } from "@/lib/seo/siteUrl";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonLd";

const siteUrl = "https://example.com";
const defaults = {
  title: "Default title",
  description: "Default description",
  keywords: ["default keyword"],
};

describe("absoluteUrl", () => {
  it("joins paths without double slashes and leaves absolute URLs alone", () => {
    expect(absoluteUrl("https://example.com/", "/about")).toBe("https://example.com/about");
    expect(absoluteUrl("https://example.com", "about")).toBe("https://example.com/about");
    expect(absoluteUrl("https://example.com", "/")).toBe("https://example.com");
    expect(absoluteUrl("https://example.com", "https://cdn.example.com/x.png")).toBe(
      "https://cdn.example.com/x.png"
    );
  });
});

describe("parseMetaRobots", () => {
  it("maps directive strings to index/follow flags", () => {
    expect(parseMetaRobots("index, follow")).toEqual({ index: true, follow: true });
    expect(parseMetaRobots("noindex, follow")).toEqual({ index: false, follow: true });
    expect(parseMetaRobots("NOINDEX,NOFOLLOW")).toEqual({ index: false, follow: false });
    expect(parseMetaRobots(undefined)).toEqual({ index: true, follow: true });
  });
});

describe("buildPageMetadata", () => {
  it("uses defaults and a derived canonical when there is no record", () => {
    const meta = buildPageMetadata({ route: "/about", siteUrl, defaults, seo: null });

    expect(meta.title).toBe("Default title");
    expect(meta.description).toBe("Default description");
    expect(meta.keywords).toEqual(["default keyword"]);
    expect(meta.alternates?.canonical).toBe("https://example.com/about");
    expect(meta.robots).toMatchObject({ index: true, follow: true });
  });

  it("derives the home canonical without a trailing slash", () => {
    const meta = buildPageMetadata({ route: "/", siteUrl, defaults, seo: null });
    expect(meta.alternates?.canonical).toBe("https://example.com");
  });

  it("applies a published record field by field", () => {
    const meta = buildPageMetadata({
      route: "/about",
      siteUrl,
      defaults,
      seo: {
        status: "published",
        title: "Managed title",
        description: "",
        primaryKeyword: "primary",
        secondaryKeywords: ["second", "Primary", ""],
        metaRobots: "noindex, follow",
        ogImage: "/uploads/common/og.webp",
      },
    });

    expect(meta.title).toBe("Managed title");
    expect(meta.description).toBe("Default description");
    expect(meta.keywords).toEqual(["primary", "second"]);
    expect(meta.robots).toMatchObject({ index: false, follow: true });
    expect(meta.openGraph).toMatchObject({
      url: "https://example.com/about",
      images: [{ url: "https://example.com/uploads/common/og.webp" }],
    });
  });

  it("ignores draft and disabled records entirely", () => {
    for (const status of ["draft", "disabled"]) {
      const meta = buildPageMetadata({
        route: "/about",
        siteUrl,
        defaults,
        seo: { status, title: "Should not apply", metaRobots: "noindex, nofollow" },
      });
      expect(meta.title).toBe("Default title");
      expect(meta.robots).toMatchObject({ index: true, follow: true });
    }
  });

  it("honours an explicit canonical override", () => {
    const meta = buildPageMetadata({
      route: "/about",
      siteUrl,
      defaults,
      seo: { status: "published", canonicalUrl: "https://example.com/who-we-are" },
    });
    expect(meta.alternates?.canonical).toBe("https://example.com/who-we-are");
    expect(meta.openGraph).toMatchObject({ url: "https://example.com/who-we-are" });
  });
});

describe("jsonLd helpers", () => {
  it("builds a BreadcrumbList with absolute item URLs and no item for the last crumb", () => {
    const ld = breadcrumbJsonLd(siteUrl, [
      { name: "Home", path: "/" },
      { name: "Blogs", path: "/blogs" },
      { name: "Post" },
    ]);
    expect(ld.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: "https://example.com" },
      { "@type": "ListItem", position: 2, name: "Blogs", item: "https://example.com/blogs" },
      { "@type": "ListItem", position: 3, name: "Post" },
    ]);
  });

  it("escapes < so content cannot close the script tag", () => {
    expect(serializeJsonLd({ name: "</script><b>" })).not.toContain("</script>");
  });
});
