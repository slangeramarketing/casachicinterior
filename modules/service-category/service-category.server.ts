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
/***************************************************
 * File: modules/service-categories/service-category.server.ts
 * Layer: Server Facade (Next.js Adapter)
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
  ServiceCategoryResponseDTO,
} from "./service-category.dto";
import { getAuthUser } from "@/lib/auth";

/* =====================================================
   Server Facade Object
===================================================== */
export const serviceCategoryServer = {
  /* =============================
      READ OPERATIONS
  ============================= */

  /**
   * Get all categories for Admin table (includes inactive)
   */
  async getAll(): Promise<ServiceCategoryResponseDTO[]> {
    const records = await listServiceCategories();
    return serviceCategoryMapper.toResponseList(records);
  },

  /**
   * Get category by ID for Edit Forms
   */
  async getById(id: string): Promise<ServiceCategoryResponseDTO | null> {
    const record = await getServiceCategoryById(id);
    if (!record) return null;
    return serviceCategoryMapper.toResponse(record);
  },

  /**
   * Get categories by parent (Useful for nested dropdowns)
   * Pass null to get top-level categories
   */
  async getByParent(parentId: string | null): Promise<ServiceCategoryResponseDTO[]> {
    const records = await listServiceCategories({
      parentId,
    });
    return serviceCategoryMapper.toResponseList(records);
  },

  /**
   * Get active categories for Public UI (Menus/Filters)
   */
  async getActive(): Promise<ServiceCategoryResponseDTO[]> {
    const records = await listServiceCategories({
      publicOnly: true,
    });
    return serviceCategoryMapper.toResponseList(records);
  },

  /* =============================
      WRITE OPERATIONS (ADMIN ONLY)
  ============================= */

  /**
   * Create category with Auth & Role check
   */
  async create(data: CreateServiceCategoryDTO): Promise<ServiceCategoryResponseDTO> {
    const user = await getAuthUser();
    if (!user || !["admin", "super_admin"].includes(user.role)) {
      throw new Error("Unauthorized: Insufficient permissions.");
    }

    const record = await createServiceCategory(data as any);
    return serviceCategoryMapper.toResponse(record);
  },

  /**
   * Update category with Auth & Role check
   */
  async update(
    id: string,
    data: UpdateServiceCategoryDTO
  ): Promise<ServiceCategoryResponseDTO | null> {
    const user = await getAuthUser();
    if (!user || !["admin", "super_admin"].includes(user.role)) {
      throw new Error("Unauthorized");
    }

    const record = await updateServiceCategory(id, data as any);
    if (!record) return null;

    return serviceCategoryMapper.toResponse(record);
  },

  /**
   * Delete category
   */
  async remove(id: string): Promise<boolean> {
    const user = await getAuthUser();
    if (!user || !["admin", "super_admin"].includes(user.role)) {
      throw new Error("Unauthorized");
    }

    // Service layer will handle children/sub-category check
    return deleteServiceCategory(id);
  },
};