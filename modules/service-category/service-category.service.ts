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
/***************************************************
 * File: modules/service-categories/service-category.service.ts
 * Layer: Service
 ***************************************************/

import { Types } from "mongoose";
import { serviceCategoryRepository } from "./service-category.repository";
import { ServiceCategoryRecord } from "./service-category.types";
import db from "@/lib/db";



export async function createServiceCategory(
  data: any // Hum DTO se data le rahe hain
): Promise<ServiceCategoryRecord> {
  await db();

  if (!data.slug) throw new Error("Slug is required");
  
  const exists = await serviceCategoryRepository.findBySlug(data.slug);
  if (exists) throw new Error("Category slug already exists");

  // Hierarchy Check
  if (data.parentId) {
    const parent = await serviceCategoryRepository.findById(data.parentId.toString());
    if (!parent) throw new Error("Parent category not found");
  }

  // 🔥 Mapping ensuring: DTO -> Database Record
  const recordToSave = {
    ...data,
    parentId: data.parentId ? new Types.ObjectId(data.parentId) : null,
    seo: {
      title: data.seo?.title || "",
      description: data.seo?.description || ""
    }
  };

  return serviceCategoryRepository.create(recordToSave);
}

/* =====================================================
   Get Category by ID
===================================================== */
export async function getServiceCategoryById(
  id: string
): Promise<ServiceCategoryRecord | null> {
  await db();
  return serviceCategoryRepository.findById(id);
}

/* =====================================================
   List Categories
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

  // Support for specific parent or top-level (null)
  if (options?.parentId !== undefined) {
    filter.parentId = options.parentId; 
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
  await db();

  // Rule 1: Self-parenting prevent karein
  if (data.parentId && data.parentId.toString() === id) {
    throw new Error("Category cannot be its own parent");
  }

  // Rule 2: Unique slug check agar change ho raha ho
  if (data.slug) {
    const existing = await serviceCategoryRepository.findBySlug(data.slug);
    if (existing && existing._id.toString() !== id) {
      throw new Error("Slug is already taken by another category");
    }
  }

  return serviceCategoryRepository.updateById(id, data);
}

/* =====================================================
   Delete Category
===================================================== */
export async function deleteServiceCategory(
  id: string
): Promise<boolean> {
  await db();

  // Rule: Check karein ki koi sub-category toh nahi judi isse?
  const hasChildren = await serviceCategoryRepository.hasChildren(id);
  if (hasChildren) {
    throw new Error("Cannot delete category with sub-categories. Remove sub-categories first.");
  }

  // Note: Yahan aap ek aur check add kar sakte hain: 
  // "Kya koi Service is category se judi hai?" 
  // (Yeh tab hoga jab aap serviceRepository ko yahan import karenge)

  return serviceCategoryRepository.deleteById(id);
}