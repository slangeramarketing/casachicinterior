/***************************************************
 * File: modules/blogs/subcategory.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Handles all MongoDB operations for SubCategory
 *
 * Responsibilities:
 * - Create, read, update, delete subcategory records
 * - Query subcategories by category or filters
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT import DTOs or Mapper
 * - Must NOT format data
 ***************************************************/

import SubCategoryModel from "./subcategory.model";
import { SubCategoryRecord } from "./subcategory.types";

export const subCategoryRepository = {
  /**
   * Purpose:
   * - Create a new subcategory
   *
   * Returns:
   * - Newly created subcategory DB record
   */
  async create(
    data: Partial<SubCategoryRecord>
  ): Promise<SubCategoryRecord> {
    const doc = await SubCategoryModel.create(data);
    return doc.toObject() as SubCategoryRecord;
  },

  /**
   * Purpose:
   * - Update subcategory by ID
   */
  async updateById(
    id: string,
    data: Partial<SubCategoryRecord>
  ): Promise<SubCategoryRecord | null> {
    const doc = await SubCategoryModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    return doc ? (doc.toObject() as SubCategoryRecord) : null;
  },

  /**
   * Purpose:
   * - Delete subcategory by ID
   */
  async deleteById(id: string): Promise<SubCategoryRecord | null> {
    const doc = await SubCategoryModel.findByIdAndDelete(id);
    return doc ? (doc.toObject() as SubCategoryRecord) : null;
  },

  /**
   * Purpose:
   * - Get subcategory by ID
   */
  async getById(id: string): Promise<SubCategoryRecord | null> {
    return (await SubCategoryModel.findById(id).lean()) as
      | SubCategoryRecord
      | null;
  },

  /**
   * Purpose:
   * - Get all subcategories
   */
  async getAll(): Promise<SubCategoryRecord[]> {
    return (await SubCategoryModel.find().lean()) as SubCategoryRecord[];
  },

  /**
   * Purpose:
   * - Get subcategories by parent category
   */
  async getByCategory(
    categoryId: string
  ): Promise<SubCategoryRecord[]> {
    return (await SubCategoryModel.find({
      category: categoryId,
    }).lean()) as SubCategoryRecord[];
  },

  /**
   * Purpose:
   * - Filter subcategories
   */
  async filter(filter: {
    category?: string;
    slug?: string;
    isActive?: boolean;
  }): Promise<SubCategoryRecord[]> {
    return (await SubCategoryModel.find(filter).lean()) as SubCategoryRecord[];
  },
};
