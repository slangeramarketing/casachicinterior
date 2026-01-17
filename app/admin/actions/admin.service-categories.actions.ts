"use server";

import { CreateServiceCategoryDTO, UpdateServiceCategoryDTO } from "@/modules/service-category/service-category.dto";
/***************************************************
 * File: app/admin/actions/service-categories.actions.ts
 * Layer: Server Action
 *
 * Purpose:
 * - Admin-facing server actions for ServiceCategory
 *
 * Responsibilities:
 * - Act as the ONLY entry point from admin UI
 * - Call serviceCategoryServer facade
 *
 * Restrictions:
 * - NO business logic
 * - NO DB access
 * - NO auth logic (handled in server facade)
 ***************************************************/


import { serviceCategoryServer } from "@/modules/service-category/service-category.server";

/* ================================
   READ
================================ */

/**
 * Get all categories (admin)
 */
export async function getAllServiceCategoriesAction() {
  return serviceCategoryServer.getAll();
}

/**
 * Get category by ID (admin)
 */
export async function getServiceCategoryByIdAction(
  id: string
) {
  return serviceCategoryServer.getById(id);
}

/**
 * Get categories by parent (admin)
 */
export async function getServiceCategoriesByParentAction(
  parentId: string | null
) {
  return serviceCategoryServer.getByParent(parentId);
}

/* ================================
   WRITE (ADMIN ONLY)
================================ */

/**
 * Create service category
 */
export async function createServiceCategoryAction(
  data: CreateServiceCategoryDTO
) {
  return serviceCategoryServer.create(data);
}

/**
 * Update service category
 */
export async function updateServiceCategoryAction(
  id: string,
  data: UpdateServiceCategoryDTO
) {
  return serviceCategoryServer.update(id, data);
}

/**
 * Delete service category
 */
export async function deleteServiceCategoryAction(
  id: string
) {
  return serviceCategoryServer.remove(id);
}
