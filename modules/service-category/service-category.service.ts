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

/* =====================================================
   Create Category
===================================================== */
export async function createServiceCategory(
  data: Partial<ServiceCategoryRecord>
): Promise<ServiceCategoryRecord> {
  const exists =
    await serviceCategoryRepository.findBySlug(data.slug!);
  if (exists) {
    throw new Error("Category slug already exists");
  }

  if (data.parentId) {
    const parent =
      await serviceCategoryRepository.findById(
        data.parentId.toString()
      );
    if (!parent) {
      throw new Error("Parent category not found");
    }
  }

  return serviceCategoryRepository.create(data);
}

/* =====================================================
   Get Category by ID
===================================================== */
export async function getServiceCategoryById(
  id: string
): Promise<ServiceCategoryRecord | null> {
  return serviceCategoryRepository.findById(id);
}

/* =====================================================
   List Categories
===================================================== */
export async function listServiceCategories(options?: {
  parentId?: string | null;
  publicOnly?: boolean;
}): Promise<ServiceCategoryRecord[]> {
  const filter: {
    parentId?: Types.ObjectId | null;
    status?: "active" | "inactive";
  } = {};

  if (options?.publicOnly) {
    filter.status = "active";
  }

  if (options?.parentId !== undefined) {
    filter.parentId = options.parentId
      ? new Types.ObjectId(options.parentId)
      : null;
  }

  return serviceCategoryRepository.findAll(filter);
}

/* =====================================================
   Update Category
===================================================== */
export async function updateServiceCategory(
  id: string,
  data: Partial<ServiceCategoryRecord>
): Promise<ServiceCategoryRecord | null> {

  if (data.parentId && data.parentId.toString() === id) {
    throw new Error("Category cannot be its own parent");
  }
  return serviceCategoryRepository.updateById(id, data);
}

/* =====================================================
   Delete Category
===================================================== */
export async function deleteServiceCategory(
  id: string
): Promise<boolean> {
  return serviceCategoryRepository.deleteById(id);
}
