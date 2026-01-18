"use server";

/***************************************************
 * File: app/admin/actions/blogs.actions.ts
 * Layer: Server Action
 *
 * Purpose:
 * - Admin-facing server actions for Blog module
 *
 * Responsibilities:
 * - Bridge Admin UI → blogServer facade
 *
 * Restrictions:
 * - NO business logic
 * - NO DB access
 * - NO auth checks
 ***************************************************/

import { blogServer } from "@/modules/blogs/blog.server";
import {
  CreateBlogDTO,
  UpdateBlogDTO,
} from "@/modules/blogs/blog.dto";

/* ================================
   READ (ADMIN)
================================ */

/**
 * Fetch all blogs (admin)
 */
export async function getAllBlogsAction() {
  return blogServer.getAll();
}

/**
 * Fetch blog by ID (admin)
 */
export async function getBlogByIdAction(
  blogId: string
) {
  return blogServer.getById(blogId);
}

/**
 * Fetch blog by SLUG (Public/Admin)
 */
export async function getBlogBySlugAction(slug: string) {
  try {
    return await blogServer.getBySlug(slug);
  } catch (error: any) {
    console.error("Error fetching blog by slug:", error.message);
    return null; // Ya aap custom error handle kar sakte hain
  }
}

/**
 * Filter blogs (admin)
 */
export async function filterBlogsAction(filter: {
  status?: "draft" | "published";
  featured?: boolean;
  categoryId?: string;
  subCategoryId?: string;
  slug?: string;
}) {
  return blogServer.filter(filter);
}

/* ================================
   WRITE (ADMIN)
================================ */

/**
 * Create blog (admin)
 */
export async function createBlogAction(
  data: CreateBlogDTO
) {
  return blogServer.create(data);
}

/**
 * Update blog (admin)
 */
export async function updateBlogAction(
  blogId: string,
  data: UpdateBlogDTO
) {
  return blogServer.update(blogId, data);
}

/**
 * Delete blog (admin)
 */
export async function deleteBlogAction(
  blogId: string
) {
  return blogServer.delete(blogId);
}
