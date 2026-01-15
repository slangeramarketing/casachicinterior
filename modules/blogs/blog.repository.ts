/***************************************************
 * File: modules/blogs/blog.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Handles MongoDB operations for Blog
 *
 * Responsibilities:
 * - CRUD operations only
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT format data
 ***************************************************/

import { Types } from "mongoose";
import BlogModel from "./blog.model";
import { BlogRecord } from "./blog.types";

export const blogRepository = {
  async create(data: Partial<BlogRecord>): Promise<BlogRecord> {
    const doc = await BlogModel.create(data);
    return doc.toObject() as BlogRecord;
  },

  async updateById(
    id: string,
    data: Partial<BlogRecord>
  ): Promise<BlogRecord | null> {
    const doc = await BlogModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return doc ? (doc.toObject() as BlogRecord) : null;
  },

  async deleteById(id: string): Promise<BlogRecord | null> {
    const doc = await BlogModel.findByIdAndDelete(id);
    return doc ? (doc.toObject() as BlogRecord) : null;
  },

  async getById(id: string): Promise<BlogRecord | null> {
    return (await BlogModel.findById(id).lean()) as BlogRecord | null;
  },

  async getAll(): Promise<BlogRecord[]> {
    return (await BlogModel.find().lean()) as BlogRecord[];
  },

  async filter(filter: {
    status?: "draft" | "published";
    featured?: boolean;
    categoryId?: Types.ObjectId | string;
    subCategoryId?: Types.ObjectId | string;
    slug?: string;
  }): Promise<BlogRecord[]> {
    return (await BlogModel.find(filter).lean()) as BlogRecord[];
  },
};
