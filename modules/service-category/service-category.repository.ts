/***************************************************
 * File: modules/service-categories/service-category.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Handles DB operations for ServiceCategory
 *
 * Responsibilities:
 * - Read / write categories from MongoDB
 * - Return plain JS objects only
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT import DTOs or Mapper
 *
 * Notes:
 * - Exports a stateless object with methods
 ***************************************************/
/***************************************************
 * File: modules/service-categories/service-category.repository.ts
 * Layer: Repository
 ***************************************************/

import { ServiceCategoryModel } from "./service-category.model";
import { ServiceCategoryRecord } from "./service-category.types";
import { Types } from "mongoose";

export const serviceCategoryRepository = {
  /**
   * Create a new category
   */
  async create(
    data: Partial<ServiceCategoryRecord>
  ): Promise<ServiceCategoryRecord> {
    const doc = await ServiceCategoryModel.create(data);
    return doc.toObject();
  },

  /**
   * Find category by MongoDB ID
   */
  async findById(
    id: string
  ): Promise<ServiceCategoryRecord | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return ServiceCategoryModel.findById(id)
      .lean<ServiceCategoryRecord>();
  },

  /**
   * Find category by unique slug
   */
  async findBySlug(
    slug: string
  ): Promise<ServiceCategoryRecord | null> {
    return ServiceCategoryModel.findOne({ slug })
      .lean<ServiceCategoryRecord>();
  },

  /**
   * List categories with robust filtering
   * - parentId: Use null for top-level categories
   */
  async findAll(filter: {
    parentId?: string | Types.ObjectId | null;
    status?: "active" | "inactive";
  } = {}): Promise<ServiceCategoryRecord[]> {
    const queryFilter: any = { ...filter };

    // Hierarchy filter handling
    if (filter.parentId !== undefined) {
      queryFilter.parentId = filter.parentId === null 
        ? null 
        : new Types.ObjectId(filter.parentId);
    }

    return ServiceCategoryModel.find(queryFilter)
      .sort({ displayOrder: 1, name: 1 }) // Order wise then Alphabetical
      .lean<ServiceCategoryRecord[]>();
  },

  /**
   * Update category by ID
   */
  async updateById(
    id: string,
    data: Partial<ServiceCategoryRecord>
  ): Promise<ServiceCategoryRecord | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    return ServiceCategoryModel.findByIdAndUpdate(
      id,
      { $set: data }, // Nested objects like SEO update safe rehta hai $set se
      { new: true, runValidators: true }
    ).lean<ServiceCategoryRecord>();
  },

  /**
   * Delete by ID
   */
  async deleteById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const res = await ServiceCategoryModel.findByIdAndDelete(id);
    return !!res;
  },

  /**
   * Extra: Check if category has children before deleting
   * (Crucial for Business Logic)
   */
  async hasChildren(parentId: string): Promise<boolean> {
    const count = await ServiceCategoryModel.countDocuments({ 
      parentId: new Types.ObjectId(parentId) 
    });
    return count > 0;
  }
};