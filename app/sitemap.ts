/***************************************************
 * File: app/sitemap.ts
 * Purpose: Generate /sitemap.xml.
 * - Static routes come from the managed page registry, so the sitemap
 *   and the dashboard agree on which pages exist.
 * - Dynamic routes come from the database (published only).
 * - A managed page whose published SEO entry says "noindex" is left out.
 * - Any data source that fails is skipped (logged) rather than turning
 *   the whole sitemap into a 500.
 ***************************************************/

import { MetadataRoute } from "next";

// Always generated per request. Without this Next.js prerenders the file at
// build time, when the database is intentionally not connected, and the
// deployed copy would never change again.
export const dynamic = "force-dynamic";
import { getAllBlogs } from "@/modules/blogs/blog.service";
import { listServices } from "@/modules/services/service.service";
import { listServiceCategories } from "@/modules/service-category/service-category.service";
import { listPageSeo } from "@/modules/seo/seo.service";
import { projects } from "@/lib/data/projects";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/siteUrl";
import { MANAGED_PAGES } from "@/lib/seo/managedPages";
import { parseMetaRobots } from "@/lib/seo/buildPageMetadata";

async function safely<T>(label: string, load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (err) {
    console.error(`[sitemap] ${label} unavailable:`, err instanceof Error ? err.message : err);
    return fallback;
  }
}

function toDate(value: unknown): Date | undefined {
  if (value instanceof Date) return value;
  if (typeof value === "string" && value) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getSiteUrl();

  const [blogs, services, categories, seoEntries] = await Promise.all([
    safely("blogs", () => getAllBlogs({ status: "published" }), []),
    safely("services", () => listServices({ publicOnly: true }), []),
    safely("service categories", () => listServiceCategories({ publicOnly: true }), []),
    safely("page seo", () => listPageSeo({ status: "published" }), []),
  ]);

  const noindexRoutes = new Set(
    seoEntries.filter((e) => !parseMetaRobots(e.metaRobots).index).map((e) => e.route)
  );
  const seoUpdatedAt = new Map(seoEntries.map((e) => [e.route, toDate(e.updatedAt)]));

  const staticRoutes: MetadataRoute.Sitemap = MANAGED_PAGES.filter(
    (p) => !noindexRoutes.has(p.route)
  ).map((p) => ({
    url: absoluteUrl(siteUrl, p.route),
    lastModified: seoUpdatedAt.get(p.route),
    changeFrequency: p.route === "/" ? "weekly" : "monthly",
    priority: p.route === "/" ? 1 : 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(siteUrl, `/services/${category.slug}`),
    lastModified: toDate(category.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(siteUrl, `/services/detail/${service.slug}`),
    lastModified: toDate(service.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: absoluteUrl(siteUrl, `/blogs/${blog.slug}`),
    lastModified: toDate(blog.updatedAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(siteUrl, `/projects/${project.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes, ...blogRoutes, ...projectRoutes];
}
