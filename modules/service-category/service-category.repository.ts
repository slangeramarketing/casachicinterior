/***************************************************
 * File: modules/service-categories/service-category.repository.ts
 * Layer: Repository
 ***************************************************/

import { ServiceCategoryModel } from "./service-category.model";
import { ServiceCategoryRecord } from "./service-category.types";
import { Types } from "mongoose";
import { AppError } from "@/lib/errors";

export const serviceCategoryRepository = {
  /* ============================
     CREATE
  ============================ */
  async create(
    data: Partial<ServiceCategoryRecord>
  ): Promise<ServiceCategoryRecord> {
    try {
      const doc = await ServiceCategoryModel.create(data);
      return doc.toObject();
    } catch (err) {
      throw new AppError({
        message: "Failed to create service category",
        code: "CATEGORY_CREATE_FAILED",
        statusCode: 500,
        context: { data },
        cause: err,
      });
    }
  },

  /* ============================
     FIND BY ID
  ============================ */
  async findById(id: string): Promise<ServiceCategoryRecord | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError({
        message: "Invalid category id",
        code: "CATEGORY_INVALID_ID",
        statusCode: 400,
        context: { id },
      });
    }

    return ServiceCategoryModel.findById(id)
      .lean<ServiceCategoryRecord>()
      .exec();
  },

  /* ============================
     FIND BY SLUG
  ============================ */
  async findBySlug(slug: string): Promise<ServiceCategoryRecord | null> {
    if (!slug) return null;

    return ServiceCategoryModel.findOne({ slug })
      .lean<ServiceCategoryRecord>()
      .exec();
  },

  /* ============================
     FIND ALL
  ============================ */
  async findAll(filter: {
    parentId?: string | Types.ObjectId | null;
    status?: "active" | "inactive";
  } = {}): Promise<ServiceCategoryRecord[]> {
    const queryFilter: any = {};

    if (filter.status) {
      queryFilter.status = filter.status;
    }

    if (filter.parentId !== undefined) {
      if (filter.parentId === null) {
        queryFilter.parentId = null;
      } else {
        if (!Types.ObjectId.isValid(filter.parentId)) {
          throw new AppError({
            message: "Invalid parentId in category filter",
            code: "CATEGORY_INVALID_PARENT_ID",
            statusCode: 400,
            context: { parentId: filter.parentId },
          });
        }
        queryFilter.parentId = new Types.ObjectId(filter.parentId);
      }
    }

    return ServiceCategoryModel.find(queryFilter)
      .sort({ displayOrder: 1, name: 1 })
      .lean<ServiceCategoryRecord[]>()
      .exec();
  },

  /* ============================
     UPDATE
  ============================ */
  async updateById(
    id: string,
    data: Partial<ServiceCategoryRecord>
  ): Promise<ServiceCategoryRecord | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError({
        message: "Invalid category id for update",
        code: "CATEGORY_INVALID_ID",
        statusCode: 400,
        context: { id },
      });
    }

    try {
      return ServiceCategoryModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      )
        .lean<ServiceCategoryRecord>()
        .exec();
    } catch (err) {
      throw new AppError({
        message: "Failed to update service category",
        code: "CATEGORY_UPDATE_FAILED",
        statusCode: 500,
        context: { id, data },
        cause: err,
      });
    }
  },

  /* ============================
     DELETE
  ============================ */
  async deleteById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError({
        message: "Invalid category id for delete",
        code: "CATEGORY_INVALID_ID",
        statusCode: 400,
        context: { id },
      });
    }

    const res = await ServiceCategoryModel.findByIdAndDelete(id).exec();
    return !!res;
  },

  /* ============================
     CHILD CHECK
  ============================ */
  async hasChildren(parentId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(parentId)) {
      throw new AppError({
        message: "Invalid parentId while checking children",
        code: "CATEGORY_INVALID_PARENT_ID",
        statusCode: 400,
        context: { parentId },
      });
    }

    const count = await ServiceCategoryModel.countDocuments({
      parentId: new Types.ObjectId(parentId),
    });

    return count > 0;
  },


  /* ============================
      FIND TOP SUB-CATEGORIES
  ============================ */
async findTopSubCategories(
  limit: number = 5
): Promise<ServiceCategoryRecord[]> {
  return ServiceCategoryModel.find({ 
        parentId: { $ne: null }, // Sirf sub-categories uthayega
        status: "active" 
      })
      .sort({ displayOrder: 1, name: 1 })
      .limit(limit)
      .lean<ServiceCategoryRecord[]>()
      .exec();
  },
};


