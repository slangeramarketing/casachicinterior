/***************************************************
 * File: modules/blogs/category.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Handles all MongoDB operations for Category
 *
 * Responsibilities:
 * - Create, read, update, delete category records
 * - Return plain DB records only
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT import DTOs or Mapper
 * - Must NOT format data
 ***************************************************/

import CategoryModel from "./category.model";
import { CategoryRecord } from "./category.types";

export const categoryRepository = {
  /**
   * Purpose:
   * - Create a new category
   *
   * Used By:
   * - CategoryService
   *
   * Returns:
   * - Newly created category DB record
   */
  async create(data: Partial<CategoryRecord>): Promise<CategoryRecord> {
    const doc = await CategoryModel.create(data);
    return doc.toObject() as CategoryRecord;
  },

  /**
   * Purpose:
   * - Update category by ID
   *
   * Used By:
   * - CategoryService
   *
   * Returns:
   * - Updated category DB record or null
   */
  async updateById(
    id: string,
    data: Partial<CategoryRecord>
  ): Promise<CategoryRecord | null> {
    const doc = await CategoryModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    return doc ? (doc.toObject() as CategoryRecord) : null;
  },

  /**
   * Purpose:
   * - Delete category by ID
   *
   * Used By:
   * - CategoryService
   *
   * Returns:
   * - Deleted category DB record or null
   */
  async deleteById(id: string): Promise<CategoryRecord | null> {
    const doc = await CategoryModel.findByIdAndDelete(id);
    return doc ? (doc.toObject() as CategoryRecord) : null;
  },

  /**
   * Purpose:
   * - Get category by ID
   *
   * Used By:
   * - CategoryService
   *
   * Returns:
   * - Category DB record or null
   */
  async getById(id: string): Promise<CategoryRecord | null> {
    return (await CategoryModel.findById(id).lean()) as CategoryRecord | null;
  },

  /**
   * Purpose:
   * - Get all categories
   *
   * Used By:
   * - CategoryService
   *
   * Returns:
   * - List of category DB records
   */
  async getAll(): Promise<CategoryRecord[]> {
    return (await CategoryModel.find().lean()) as CategoryRecord[];
  },

  /**
   * Purpose:
   * - Get categories by filter
   *
   * Used By:
   * - CategoryService
   *
   * Returns:
   * - Filtered category DB records
   */
  async filter(filter: {
    isActive?: boolean;
    slug?: string;
    name?: string;
  }): Promise<CategoryRecord[]> {
    return (await CategoryModel.find(filter).lean()) as CategoryRecord[];
  },
};
