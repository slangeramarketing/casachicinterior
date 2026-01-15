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
import { ServiceRecord } from "./service.types";

/* -------------------------------------
   Repository Object
------------------------------------- */
export const serviceRepository = {
  /**
   * Purpose:
   * - Create a new service record
   */
  async create(data: Partial<ServiceRecord>): Promise<ServiceRecord> {
    const doc = await ServiceModel.create(data);
    return doc.toObject();
  },

  /**
   * Purpose:
   * - Find service by MongoDB ID
   */
  async findById(id: string): Promise<ServiceRecord | null> {
    return ServiceModel.findById(id).lean<ServiceRecord>();
  },

  /**
   * Purpose:
   * - Find service by slug
   */
  async findBySlug(slug: string): Promise<ServiceRecord | null> {
    return ServiceModel.findOne({ slug }).lean<ServiceRecord>();
  },

/**
 * List services with optional limit
 */
async findAll(
  filter: {
    status?: "draft" | "published";
    categoryId?: Types.ObjectId;
    featured?: boolean;
  } = {},
  options?: {
    limit?: number;
  }
): Promise<ServiceRecord[]> {
  const query = ServiceModel.find(filter)
    .sort({ displayOrder: 1, createdAt: -1 });

  if (options?.limit) {
    query.limit(options.limit);
  }

  return query.lean<ServiceRecord[]>();
},


  /**
   * Purpose:
   * - Update service by ID
   */
  async updateById(
    id: string,
    data: Partial<ServiceRecord>
  ): Promise<ServiceRecord | null> {
    return ServiceModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean<ServiceRecord>();
  },

  /**
   * Purpose:
   * - Delete service by ID
   */
  async deleteById(id: string): Promise<boolean> {
    const res = await ServiceModel.findByIdAndDelete(id);
    return !!res;
  },
};
