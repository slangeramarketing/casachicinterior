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

import { ServiceCategoryModel } from "./service-category.model";
import { ServiceCategoryRecord } from "./service-category.types";
import { Types } from "mongoose";

export const serviceCategoryRepository = {
  /**
   * Create category
   */
  async create(
    data: Partial<ServiceCategoryRecord>
  ): Promise<ServiceCategoryRecord> {
    const doc = await ServiceCategoryModel.create(data);
    return doc.toObject();
  },

  /**
   * Find by ID
   */
  async findById(
    id: string
  ): Promise<ServiceCategoryRecord | null> {
    return ServiceCategoryModel.findById(id)
      .lean<ServiceCategoryRecord>();
  },

  /**
   * Find by slug
   */
  async findBySlug(
    slug: string
  ): Promise<ServiceCategoryRecord | null> {
    return ServiceCategoryModel.findOne({ slug })
      .lean<ServiceCategoryRecord>();
  },

  /**
   * List categories
   * (optionally by parentId / status)
   */
  async findAll(filter: {
    parentId?: Types.ObjectId | null;
    status?: "active" | "inactive";
  } = {}): Promise<ServiceCategoryRecord[]> {
    return ServiceCategoryModel.find(filter)
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean<ServiceCategoryRecord[]>();
  },

  /**
   * Update by ID
   */
  async updateById(
    id: string,
    data: Partial<ServiceCategoryRecord>
  ): Promise<ServiceCategoryRecord | null> {
    return ServiceCategoryModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    ).lean<ServiceCategoryRecord>();
  },

  /**
   * Delete by ID
   */
  async deleteById(id: string): Promise<boolean> {
    const res =
      await ServiceCategoryModel.findByIdAndDelete(id);
    return !!res;
  },
};
