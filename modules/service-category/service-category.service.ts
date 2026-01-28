/***************************************************
 * File: modules/service-categories/service-category.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Business logic for ServiceCategory
 *
 * Responsibilities:
 * - Enforce domain rules
 * - Validate hierarchy constraints
 *
 * Restrictions:
 * - Must NOT format response
 * - Must NOT return DTOs
 * - Must NOT use object+method export
 ***************************************************/

import { Types } from "mongoose";
import { serviceCategoryRepository } from "./service-category.repository";
import { ServiceCategoryRecord } from "./service-category.types";
import db from "@/lib/db";
import { AppError } from "@/lib/errors";

/* =====================================================
   CREATE CATEGORY
===================================================== */
export async function createServiceCategory(
  data: any
): Promise<ServiceCategoryRecord> {
  await db();

  if (!data.slug) {
    throw new AppError({
      message: "Category slug is required",
      code: "CATEGORY_SLUG_REQUIRED",
      statusCode: 400,
      context: { data },
    });
  }

  const exists = await serviceCategoryRepository.findBySlug(data.slug);
  if (exists) {
    throw new AppError({
      message: "Category slug already exists",
      code: "CATEGORY_SLUG_DUPLICATE",
      statusCode: 409,
      context: { slug: data.slug },
    });
  }

  // Hierarchy validation
  if (data.parentId) {
    const parentId = data.parentId.toString();

    if (!Types.ObjectId.isValid(parentId)) {
      throw new AppError({
        message: "Invalid parent category id",
        code: "CATEGORY_INVALID_PARENT_ID",
        statusCode: 400,
        context: { parentId },
      });
    }

    const parent = await serviceCategoryRepository.findById(parentId);
    if (!parent) {
      throw new AppError({
        message: "Parent category not found",
        code: "CATEGORY_PARENT_NOT_FOUND",
        statusCode: 404,
        context: { parentId },
      });
    }
  }

  const recordToSave: Partial<ServiceCategoryRecord> = {
    ...data,
    parentId: data.parentId
      ? new Types.ObjectId(data.parentId)
      : null,
    seo: {
      title: data.seo?.title || "",
      description: data.seo?.description || "",
    },
  };

  return serviceCategoryRepository.create(recordToSave);
}

/* =====================================================
   GET BY ID
===================================================== */
export async function getServiceCategoryById(
  id: string
): Promise<ServiceCategoryRecord | null> {
  await db();
  return serviceCategoryRepository.findById(id);
}

/* =====================================================
   LIST CATEGORIES
===================================================== */
export async function listServiceCategories(options?: {
  parentId?: string | null;
  publicOnly?: boolean;
}): Promise<ServiceCategoryRecord[]> {
  await db();

  const filter: any = {};

  if (options?.publicOnly) {
    filter.status = "active";
  }

  if (options?.parentId !== undefined) {
    filter.parentId = options.parentId;
  }

  return serviceCategoryRepository.findAll(filter);
}

/* =====================================================
   UPDATE CATEGORY
===================================================== */
export async function updateServiceCategory(
  id: string,
  data: Partial<ServiceCategoryRecord>
): Promise<ServiceCategoryRecord | null> {
  await db();

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError({
      message: "Invalid category id",
      code: "CATEGORY_INVALID_ID",
      statusCode: 400,
      context: { id },
    });
  }

  // Prevent self-parenting
  if (data.parentId && data.parentId.toString() === id) {
    throw new AppError({
      message: "Category cannot be its own parent",
      code: "CATEGORY_SELF_PARENT",
      statusCode: 400,
      context: { id },
    });
  }

  // Slug uniqueness
  if (data.slug) {
    const existing = await serviceCategoryRepository.findBySlug(data.slug);
    if (existing && existing._id.toString() !== id) {
      throw new AppError({
        message: "Slug is already taken by another category",
        code: "CATEGORY_SLUG_DUPLICATE",
        statusCode: 409,
        context: { slug: data.slug, id },
      });
    }
  }

  return serviceCategoryRepository.updateById(id, data);
}

/* =====================================================
   DELETE CATEGORY
===================================================== */
export async function deleteServiceCategory(
  id: string
): Promise<boolean> {
  await db();

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError({
      message: "Invalid category id",
      code: "CATEGORY_INVALID_ID",
      statusCode: 400,
      context: { id },
    });
  }

  const hasChildren = await serviceCategoryRepository.hasChildren(id);
  if (hasChildren) {
    throw new AppError({
      message:
        "Cannot delete category with sub-categories. Remove sub-categories first.",
      code: "CATEGORY_HAS_CHILDREN",
      statusCode: 409,
      context: { id },
    });
  }

  return serviceCategoryRepository.deleteById(id);
}
