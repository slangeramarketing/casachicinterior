/***************************************************
 * File: modules/blogs/blog.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Stateless object for pure MongoDB operations for Blogs.
 *
 * Responsibilities:
 * - CRUD operations returning lean objects.
 * - Population of category and author references.
 *
 * Restrictions:
 * - Must NOT use DTOs (Uses IBlogRecord/IPopulatedBlogRecord).
 * - Must NOT contain business logic or formatting.
 * - Must NOT return Mongoose Documents (Use .lean()).
 ***************************************************/
import { BlogModel } from "./blog.model";
import "@/modules/blog-category/blog-category.model"; // Ensure model registration
import "@/modules/users/user.model"; // Ensure model registration
import db from "@/lib/db";
import { IBlogRecord, IPopulatedBlogRecord } from "./blog.types";

export const blogRepository = {
  /**
   * Purpose: Fetch all blogs with populated references
   */
  async findAll(query: any = {}): Promise<IPopulatedBlogRecord[]> {
    await db();
    return await BlogModel.find(query)
      .populate("categoryId", "name slug")
      .populate("authorId", "name image")
      .sort({ createdAt: -1 })
      .lean() as unknown as IPopulatedBlogRecord[];
  },

  /**
   * Purpose: Get single blog by ID with full population
   */
  async findById(id: string): Promise<IPopulatedBlogRecord | null> {
    await db();
    return await BlogModel.findById(id)
      .populate("categoryId")
      .populate("authorId")
      .lean() as unknown as IPopulatedBlogRecord;
  },

  /**
   * Purpose: Get single blog by Slug
   */
  async findBySlug(slug: string): Promise<IPopulatedBlogRecord | null> {
    await db();
    return await BlogModel.findOne({ slug })
      .populate("categoryId")
      .populate("authorId")
      .lean() as unknown as IPopulatedBlogRecord;
  },

  /**
   * Purpose: Create a new blog record
   */
  async create(data: Partial<IBlogRecord>): Promise<IBlogRecord> {
    await db();
    const doc = await BlogModel.create(data);
    return doc.toObject();
  },

  /**
   * Purpose: Update blog record
   */
  async update(id: string, data: Partial<IBlogRecord>): Promise<IBlogRecord | null> {
    await db();
    return await BlogModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean() as IBlogRecord;
  },

  /**
   * Purpose: Delete blog record
   */
  async delete(id: string): Promise<IBlogRecord | null> {
    await db();
    return await BlogModel.findByIdAndDelete(id).lean() as IBlogRecord;
  },

  /**
   * Purpose: Increment blog view count
   */
  async incrementViews(id: string): Promise<void> {
    await db();
    await BlogModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
  }
};