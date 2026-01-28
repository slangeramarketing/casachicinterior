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
/***************************************************
 * File: modules/services/service.repository.ts
 * Layer: Repository
 ***************************************************/

import { Types } from "mongoose";
import { ServiceModel } from "./service.model";
import {
  ServiceRecord,
  ServiceWithPopulatedCategory,
} from "./service.types";
import { ServiceCategoryModel } from "../service-category/service-category.model";
import { DatabaseError, InvalidIdError } from "@/lib/errors";

/**
 * Small helper: ObjectId validation with context
 */
function assertValidObjectId(id: string, context: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidIdError(`Invalid MongoDB id in ${context}`, {
      id,
      layer: "repository",
      module: "service",
    });
  }
}

export const serviceRepository = {
  /**
   * Create a new service record
   */
  async create(data: Partial<ServiceRecord>): Promise<ServiceRecord> {
    try {
      const doc = await ServiceModel.create(data);
      return doc.toObject();
    } catch (err: any) {
      throw new DatabaseError("Failed to create service", {
        originalError: err,
        data,
        operation: "create",
        module: "service",
      });
    }
  },

  /**
   * Find service by MongoDB ID with populated category
   */
  async findById(id: string): Promise<ServiceWithPopulatedCategory | null> {
    assertValidObjectId(id, "serviceRepository.findById");

    try {
      return await ServiceModel.findById(id)
        .populate({
          path: "categoryId",
          model: ServiceCategoryModel,
          select: "name slug icon",
        })
        .lean<ServiceWithPopulatedCategory>()
        .exec();
    } catch (err: any) {
      throw new DatabaseError("Failed to find service by id", {
        originalError: err,
        id,
        operation: "findById",
        module: "service",
      });
    }
  },

  /**
   * Find service by slug
   */
  async findBySlug(slug: string): Promise<ServiceWithPopulatedCategory | null> {
    try {
      return await ServiceModel.findOne({ slug })
        .populate({
          path: "categoryId",
          model: ServiceCategoryModel,
          select: "name slug icon",
        })
        .lean<ServiceWithPopulatedCategory>()
        .exec();
    } catch (err: any) {
      throw new DatabaseError("Failed to find service by slug", {
        originalError: err,
        slug,
        operation: "findBySlug",
        module: "service",
      });
    }
  },

  /**
   * List services with filtering & population
   */
  async findAll(
    filter: any = {},
    options?: { limit?: number; skip?: number }
  ): Promise<ServiceWithPopulatedCategory[]> {
    try {
      const query = ServiceModel.find(filter)
        .populate({
          path: "categoryId",
          model: ServiceCategoryModel,
          select: "name slug icon",
        })
        .sort({ displayOrder: 1, createdAt: -1 });

      if (options?.limit) query.limit(options.limit);
      if (options?.skip) query.skip(options.skip);

      return await query.lean<ServiceWithPopulatedCategory[]>().exec();
    } catch (err: any) {
      throw new DatabaseError("Failed to list services", {
        originalError: err,
        filter,
        options,
        operation: "findAll",
        module: "service",
      });
    }
  },

  /**
   * Update service by ID
   */
  async updateById(
    id: string,
    data: Partial<ServiceRecord>
  ): Promise<ServiceWithPopulatedCategory | null> {
    assertValidObjectId(id, "serviceRepository.updateById");

    try {
      return await ServiceModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      )
        .populate({
          path: "categoryId",
          model: ServiceCategoryModel,
          select: "name slug icon",
        })
        .lean<ServiceWithPopulatedCategory>()
        .exec();
    } catch (err: any) {
      throw new DatabaseError("Failed to update service", {
        originalError: err,
        id,
        data,
        operation: "updateById",
        module: "service",
      });
    }
  },

  /**
   * Delete service by ID
   */
  async deleteById(id: string): Promise<boolean> {
    assertValidObjectId(id, "serviceRepository.deleteById");

    try {
      const res = await ServiceModel.findByIdAndDelete(id).exec();
      return !!res;
    } catch (err: any) {
      throw new DatabaseError("Failed to delete service", {
        originalError: err,
        id,
        operation: "deleteById",
        module: "service",
      });
    }
  },

  async count(filter: object = {}): Promise<number> {
    try {
      return await ServiceModel.countDocuments(filter).exec();
    } catch (err: any) {
      throw new DatabaseError("Failed to count services", {
        originalError: err,
        filter,
        operation: "count",
        module: "service",
      });
    }
  },
};
