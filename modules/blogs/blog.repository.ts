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

import BlogModel from "./blog.model";
import { BlogPopulatedRecord, BlogRecord } from "./blog.types";

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

  async getByIdPopulated(id: string): Promise<BlogPopulatedRecord | null> {
      return (await BlogModel.findById(id)
        .populate("categoryId", "name slug") // Sirf name aur slug mangwayein
        .populate("subCategoryId", "name slug")
        .lean()) as BlogPopulatedRecord | null;
    },
  
  async getBySlugPopulated(slug: string): Promise<BlogPopulatedRecord | null> {
    return (await BlogModel.findOne({ slug })
      .populate("categoryId", "name slug")
      .populate("subCategoryId", "name slug")
      .lean()) as BlogPopulatedRecord | null;
  },

  async getAllPopulated(): Promise<BlogPopulatedRecord[]> {
    return (await BlogModel.find()
      .sort({ createdAt: -1 }) // Latest blogs upar
      .populate("categoryId", "name slug")
      .populate("subCategoryId", "name slug")
      .lean()) as BlogPopulatedRecord[];
  },

  // Filtered populated data
  async filterPopulated(query: any): Promise<BlogPopulatedRecord[]> {
    return (await BlogModel.find(query)
      .populate("categoryId", "name slug")
      .populate("subCategoryId", "name slug")
      .lean()) as BlogPopulatedRecord[];
  }
};
