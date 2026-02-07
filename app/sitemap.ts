/***************************************************
 * File: app/sitemap.ts
 * Purpose: Generate dynamic XML sitemap for SEO.
 * Responsibilities:
 * - Fetch dynamic slugs from Services.
 * - Combine static and dynamic routes.
 ***************************************************/

import { MetadataRoute } from "next";
import { getAllBlogs } from "@/modules/blogs/blog.service";
import { listServices } from "@/modules/services/service.service";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { projects } from "@/lib/data/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Base URL fetch karein (Local/Prod dono ke liye safe)
  const baseUrl = await getBaseUrl();

  // 2. Dynamic Data fetch karein (Services ka use karke)
  const [blogs, services] = await Promise.all([
    getAllBlogs({ status: "published" }),
    listServices({ publicOnly: true }),
  ]);

  // 3. Static Routes define karein
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/blogs",
    "/privacy-policy",
    "/terms-of-service",
    "/sitemap", // Aapka HTML sitemap page
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 4. Dynamic Blog Routes map karein
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 5. Dynamic Service Routes map karein
  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/detail/${service.slug}`,
    lastModified: new Date(service.updatedAt || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 5. Dynamic Project Routes map karein
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(), // Kyunki static hai, aaj ki date use kar sakte hain
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));


  // Sabko merge karke return karein
  return [...staticRoutes, ...blogRoutes, ...serviceRoutes, ...projectRoutes];
}