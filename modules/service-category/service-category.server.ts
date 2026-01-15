/***************************************************
 * File: modules/service-categories/service-category.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Next.js server adapter for ServiceCategory module
 *
 * Responsibilities:
 * - Perform auth & role checks for WRITE operations
 * - Call service layer only
 * - Apply mapper before returning response
 *
 * Restrictions:
 * - Must NOT access repository directly
 * - Must NOT contain business logic
 * - Must NOT return raw DB records
 *
 * Notes:
 * - Exports a stateless object with methods
 ***************************************************/

import {
  createServiceCategory,
  listServiceCategories,
  updateServiceCategory,
  deleteServiceCategory,
  getServiceCategoryById,
} from "./service-category.service";
import { serviceCategoryMapper } from "./service-category.mapper";
import {
  CreateServiceCategoryDTO,
  UpdateServiceCategoryDTO,
} from "./service-category.dto";
import { getAuthUser } from "@/lib/auth";

/* =====================================================
   Server Facade
===================================================== */
export const serviceCategoryServer = {
  /* =============================
     READ OPERATIONS
  ============================= */

  /**
   * Get all categories (admin)
   */
  async getAll() {
    const records = await listServiceCategories();
    return serviceCategoryMapper.toResponseList(records);
  },

  /**
   * Get category by ID (admin)
   */
  async getById(id: string) {
    const record = await getServiceCategoryById(id);
    if (!record) return null;

    return serviceCategoryMapper.toResponse(record);
  },

  /**
   * Get categories by parent
   */
  async getByParent(parentId: string | null) {
    const records = await listServiceCategories({
      parentId,
    });
    return serviceCategoryMapper.toResponseList(records);
  },

  /**
   * Get active categories (public)
   */
  async getActive() {
    const records = await listServiceCategories({
      publicOnly: true,
    });
    return serviceCategoryMapper.toResponseList(records);
  },

  /* =============================
     WRITE OPERATIONS (ADMIN)
  ============================= */

  /**
   * Create category
   */
  async create(data: CreateServiceCategoryDTO) {
    const user = await getAuthUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }


    const record = await createServiceCategory(
      data as any
    );

    return serviceCategoryMapper.toResponse(record);
  },

  /**
   * Update category
   */
  async update(
    id: string,
    data: UpdateServiceCategoryDTO
  ) {
    const user = await getAuthUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await updateServiceCategory(
      id,
      data as any
    );

    if (!record) return null;

    return serviceCategoryMapper.toResponse(record);
  },

  /**
   * Delete category
   */
  async remove(id: string) {
    const user = await getAuthUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    return deleteServiceCategory(id);
  },
};
