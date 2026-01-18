/***************************************************
 * File: modules/blogs/blog.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Next.js server-side adapter for Blog module
 *
 * Responsibilities:
 * - Perform auth & role checks for WRITE operations
 * - Call service functions
 * - Map DB records to Response DTOs
 *
 * Restrictions:
 * - Must NOT access repository directly
 * - Must NOT contain business logic
 * - Must NOT return plain DB records
 ***************************************************/

import { getAuthUser } from "@/lib/auth";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getAllBlogs,
  filterBlogs,
  getBlogBySlug,
} from "./blog.service";
import { blogMapper } from "./blog.mapper";
import { CreateBlogDTO, UpdateBlogDTO } from "./blog.dto";

export const blogServer = {
  /**
   * Create blog (ADMIN only)
   */
  async create(data: CreateBlogDTO) {
    const authUser = await getAuthUser();

    if (!authUser || (authUser.role !== "admin" && authUser.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await createBlog(authUser.userId, data);
    return blogMapper.toResponse(record);
  },

  /**
   * Update blog (ADMIN only)
   */
  async update(id: string, data: UpdateBlogDTO) {
    const authUser = await getAuthUser();

    if (!authUser || (authUser.role !== "admin" && authUser.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await updateBlog(id, data);
    return blogMapper.toResponse(record);
  },

  /**
   * Delete blog (ADMIN only)
   */
  async delete(id: string) {
    const authUser = await getAuthUser();

    if (!authUser || (authUser.role !== "admin" && authUser.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await deleteBlog(id);
    return blogMapper.toResponse(record);
  },

  /**
   * Get blog by ID (Admin / Server Components)
   */
  async getById(id: string) {
    const record = await getBlogById(id);
    return blogMapper.toResponse(record);
  },

  /**
   * Get blog by Slug (Public / Server Components)
   */
  async getBySlug(slug: string) {
    const record = await getBlogBySlug(slug);
    return blogMapper.toResponse(record);
  },

  /**
   * Get all blogs (Admin / Server Components)
   */
  async getAll() {
    const records = await getAllBlogs();
    return blogMapper.toResponseList(records);
  },

  /**
   * Filter blogs (Admin / Server Components)
   */
  async filter(filter: {
    status?: "draft" | "published";
    featured?: boolean;
    categoryId?: string;
    subCategoryId?: string;
    slug?: string;
  }) {
    const records = await filterBlogs(filter);
    return blogMapper.toResponseList(records);
  },
};
