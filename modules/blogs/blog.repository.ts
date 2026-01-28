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
/***************************************************
 * File: modules/blogs/blog.repository.ts
 * Layer: Repository
 ***************************************************/

import { Types } from "mongoose";
import { BlogModel } from "./blog.model";
import "@/modules/blog-category/blog-category.model";
import "@/modules/users/user.model";
import db from "@/lib/db";
import { IBlogRecord, IPopulatedBlogRecord } from "./blog.types";
import { AppError } from "@/lib/errors/AppError";

export const blogRepository = {
  /**
   * Fetch all blogs (populated)
   */
  async findAll(
    filter: Record<string, any> = {}
  ): Promise<IPopulatedBlogRecord[]> {
    await db();

    try {
      return await BlogModel.find(filter)
        .populate({
          path: "categoryId",
          select: "name slug",
        })
        .populate({
          path: "authorId",
          select: "name image",
        })
        .sort({ createdAt: -1 })
        .lean<IPopulatedBlogRecord[]>();
    } catch (err) {
      throw new AppError({
        message: "Failed to fetch blogs",
        code: "BLOG_FIND_ALL_FAILED",
        statusCode: 500,
        context: { filter },
        cause: err,
      });
    }
  },

  /**
   * Find blog by ID (populated)
   */
  async findById(id: string): Promise<IPopulatedBlogRecord | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    await db();

    try {
      return await BlogModel.findById(id)
        .populate({
          path: "categoryId",
          select: "name slug",
        })
        .populate({
          path: "authorId",
          select: "name image",
        })
        .lean<IPopulatedBlogRecord>();
    } catch (err) {
      throw new AppError({
        message: "Failed to fetch blog by ID",
        code: "BLOG_FIND_BY_ID_FAILED",
        statusCode: 500,
        context: { id },
        cause: err,
      });
    }
  },

  /**
   * Find blog by slug (populated)
   */
  async findBySlug(slug: string): Promise<IPopulatedBlogRecord | null> {
    await db();

    try {
      return await BlogModel.findOne({ slug })
        .populate({
          path: "categoryId",
          select: "name slug",
        })
        .populate({
          path: "authorId",
          select: "name image",
        })
        .lean<IPopulatedBlogRecord>();
    } catch (err) {
      throw new AppError({
        message: "Failed to fetch blog by slug",
        code: "BLOG_FIND_BY_SLUG_FAILED",
        statusCode: 500,
        context: { slug },
        cause: err,
      });
    }
  },

  /**
   * Create blog
   */
  async create(
    data: Partial<IBlogRecord>
  ): Promise<IBlogRecord> {
    await db();

    try {
      const doc = await BlogModel.create(data);
      return doc.toObject();
    } catch (err) {
      throw new AppError({
        message: "Failed to create blog",
        code: "BLOG_CREATE_FAILED",
        statusCode: 500,
        context: { data },
        cause: err,
      });
    }
  },

  /**
   * Update blog
   */
  async updateById(
    id: string,
    data: Partial<IBlogRecord>
  ): Promise<IBlogRecord | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    await db();

    try {
      return await BlogModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).lean<IBlogRecord>();
    } catch (err) {
      throw new AppError({
        message: "Failed to update blog",
        code: "BLOG_UPDATE_FAILED",
        statusCode: 500,
        context: { id, data },
        cause: err,
      });
    }
  },

  /**
   * Delete blog
   */
  async deleteById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    await db();

    try {
      const res = await BlogModel.findByIdAndDelete(id);
      return !!res;
    } catch (err) {
      throw new AppError({
        message: "Failed to delete blog",
        code: "BLOG_DELETE_FAILED",
        statusCode: 500,
        context: { id },
        cause: err,
      });
    }
  },

  /**
   * Increment view count
   */
  async incrementViews(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;

    await db();

    try {
      await BlogModel.findByIdAndUpdate(id, {
        $inc: { viewCount: 1 },
      });
    } catch (err) {
      throw new AppError({
        message: "Failed to increment blog views",
        code: "BLOG_INCREMENT_VIEWS_FAILED",
        statusCode: 500,
        context: { id },
        cause: err,
      });
    }
  },
};
