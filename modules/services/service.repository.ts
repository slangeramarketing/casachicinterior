/***************************************************
 * File: modules/services/service.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Handles all database operations for Service module
 *
 * Responsibilities:
 * - Read / write Service documents from MongoDB
 * - Return plain JavaScript objects only
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT import DTOs or Mapper
 * - Must NOT format data
 *
 * Notes:
 * - This file exports a stateless object with methods
 ***************************************************/


import { Types } from "mongoose";
import { ServiceModel } from "./service.model";
import { ServiceRecord, ServiceWithPopulatedCategory } from "./service.types";
import { ServiceCategoryModel } from "../service-category/service-category.model";

export const serviceRepository = {
  /**
   * Create a new service record
   */
  async create(data: Partial<ServiceRecord>): Promise<ServiceRecord> {
    const doc = await ServiceModel.create(data);
    console.log("DB SAVED DOC:", doc);
    return doc.toObject();
  },

  /**
   * Find service by MongoDB ID with Selective Populated Category
   */
  async findById(id: string): Promise<ServiceWithPopulatedCategory | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    return await ServiceModel.findById(id)
      .populate({
        path: "categoryId",
        model: "ServiceCategory",
        select: "name slug icon", 
      })
      .lean<ServiceWithPopulatedCategory>()
      .exec();
  },

  /**
   * Find service by slug (Unique URL)
   */
  async findBySlug(slug: string): Promise<ServiceWithPopulatedCategory | null> {
    return ServiceModel.findOne({ slug })
      .populate({
        path: "categoryId",
        select: "name slug icon",
      })
      .lean<ServiceWithPopulatedCategory>();
  },

  /**
   * List services with robust filtering and Population
   */
  async findAll(
    filter: any = {},
    options?: { limit?: number; skip?: number }
  ): Promise<ServiceWithPopulatedCategory[]> {
    const query = ServiceModel.find(filter)
      .populate({
        path: "categoryId",
        select: "name slug icon",
        model: ServiceCategoryModel, // 👈 Ye line Mongoose ko batayegi ki exactly kaunsa model use karna hai
      })
      .sort({ displayOrder: 1, createdAt: -1 });

    if (options?.limit) query.limit(options.limit);
    if (options?.skip) query.skip(options.skip);

    return query.lean<ServiceWithPopulatedCategory[]>();
  },

  /**
   * Update service by ID (Returns populated updated record)
   */
  async updateById(
    id: string,
    data: Partial<ServiceRecord>
  ): Promise<ServiceWithPopulatedCategory | null> {
    if (!Types.ObjectId.isValid(id)) return null;

      console.log("Income Data", data);
    
  
     const doc= await ServiceModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
      .populate({
        path: "categoryId",
        select: "name slug icon",
      })
      .lean<ServiceWithPopulatedCategory>();

      console.log("DB SAVED DOC:", doc);

      return doc;
  },

  async deleteById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const res = await ServiceModel.findByIdAndDelete(id);
    return !!res;
  },

  async count(filter: object = {}): Promise<number> {
    return ServiceModel.countDocuments(filter);
  }
};