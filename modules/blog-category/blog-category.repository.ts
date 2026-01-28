/***************************************************
 * File: modules/blog-categories/blog-category.repository.ts
 * Layer: Repository
 ***************************************************/

import { Types } from "mongoose";
import { BlogCategoryModel } from "./blog-category.model";
import { IBlogCategoryRecord } from "./blog-category.types";
import { AppError } from "@/lib/errors/AppError";

/* -------------------------------------
   BLOG CATEGORY REPOSITORY
------------------------------------- */
export const blogCategoryRepository = {
  /* =========================
     READ
  ========================= */

  async findAll(): Promise<IBlogCategoryRecord[]> {
    try {
      return await BlogCategoryModel.find()
        .populate({
          path: "parentId",
          select: "name slug",
        })
        .sort({ displayOrder: 1, name: 1 })
        .lean<IBlogCategoryRecord[]>();
    } catch (err) {
      throw new AppError({
        message: "Failed to fetch blog categories",
        code: "BLOG_CATEGORY_FIND_ALL_FAILED",
        statusCode: 500,
        context: { error: err },
        cause: err,
      });
    }
  },

  async findBySlug(slug: string): Promise<IBlogCategoryRecord | null> {
    try {
      return await BlogCategoryModel.findOne({ slug })
        .lean<IBlogCategoryRecord>();
    } catch (err) {
      throw new AppError({
        message: "Failed to fetch blog category by slug",
        code: "BLOG_CATEGORY_FIND_BY_SLUG_FAILED",
        statusCode: 500,
        context: { slug },
        cause: err,
      });
    }
  },

  async findById(id: string): Promise<IBlogCategoryRecord | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    try {
      return await BlogCategoryModel.findById(id)
        .populate({
          path: "parentId",
          select: "name slug",
        })
        .lean<IBlogCategoryRecord>();
    } catch (err) {
      throw new AppError({
        message: "Failed to fetch blog category by ID",
        code: "BLOG_CATEGORY_FIND_BY_ID_FAILED",
        statusCode: 500,
        context: { id },
        cause: err,
      });
    }
  },

  /* =========================
     WRITE
  ========================= */

  async create(
    data: Partial<IBlogCategoryRecord>
  ): Promise<IBlogCategoryRecord> {
    try {
      const doc = await BlogCategoryModel.create(data);
      return doc.toObject();
    } catch (err) {
      throw new AppError({
        message: "Failed to create blog category",
        code: "BLOG_CATEGORY_CREATE_FAILED",
        statusCode: 500,
        context: { data },
        cause: err,
      });
    }
  },

  async updateById(
    id: string,
    data: Partial<IBlogCategoryRecord>
  ): Promise<IBlogCategoryRecord | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    try {
      return await BlogCategoryModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).lean<IBlogCategoryRecord>();
    } catch (err) {
      throw new AppError({
        message: "Failed to update blog category",
        code: "BLOG_CATEGORY_UPDATE_FAILED",
        statusCode: 500,
        context: { id, data },
        cause: err,
      });
    }
  },

  async deleteById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    try {
      const res = await BlogCategoryModel.findByIdAndDelete(id);
      return !!res;
    } catch (err) {
      throw new AppError({
        message: "Failed to delete blog category",
        code: "BLOG_CATEGORY_DELETE_FAILED",
        statusCode: 500,
        context: { id },
        cause: err,
      });
    }
  },

  /* =========================
     HELPERS
  ========================= */

  async hasChildren(parentId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(parentId)) return false;

    try {
      const count = await BlogCategoryModel.countDocuments({
        parentId: new Types.ObjectId(parentId),
      });
      return count > 0;
    } catch (err) {
      throw new AppError({
        message: "Failed to check blog category children",
        code: "BLOG_CATEGORY_HAS_CHILDREN_FAILED",
        statusCode: 500,
        context: { parentId },
        cause: err,
      });
    }
  },
};
