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
  getServiceCategoryBySlug,
  getTopSubCategories,
} from "./service-category.service";
import { serviceCategoryMapper } from "./service-category.mapper";
import {
  CreateServiceCategoryDTO,
  UpdateServiceCategoryDTO,
  ServiceCategoryResponseDTO,
} from "./service-category.dto";
import { getAuthUser } from "@/lib/auth";
import { AppError } from "@/lib/errors";

/* =====================================================
   Helper: Admin Auth Guard
===================================================== */
async function requireAdmin() {
  const user = await getAuthUser();

  if (!user || !["admin", "super_admin"].includes(user.role)) {
    throw new AppError({
      message: "Unauthorized: Admin access required",
      code: "AUTH_FORBIDDEN",
      statusCode: 403,
      context: {
        userId: user?.userId,
        role: user?.role,
      },
    });
  }

  return user;
}

/* =====================================================
   Server Facade Object
===================================================== */
export const serviceCategoryServer = {
  /* =============================
      READ OPERATIONS
  ============================= */

  async getAll(): Promise<ServiceCategoryResponseDTO[]> {
    const records = await listServiceCategories();
    return serviceCategoryMapper.toResponseList(records);
  },

  async getById(id: string): Promise<ServiceCategoryResponseDTO | null> {
    const record = await getServiceCategoryById(id);
    if (!record) return null;
    return serviceCategoryMapper.toResponse(record);
  },

    async getBySlug(
    slug: string
  ): Promise<ServiceCategoryResponseDTO | null> {
    const record = await getServiceCategoryBySlug(slug);
    if (!record) return null;
    return serviceCategoryMapper.toResponse(record);
  },


  async getByParent(
    parentId: string | null
  ): Promise<ServiceCategoryResponseDTO[]> {
    const records = await listServiceCategories({ parentId });
    return serviceCategoryMapper.toResponseList(records);
  },

  async getActive(): Promise<ServiceCategoryResponseDTO[]> {
    const records = await listServiceCategories({ publicOnly: true });
    return serviceCategoryMapper.toResponseList(records);
  },

  /**
   * ✅ GET TOP 5 SUB-CATEGORIES
   * Purpose: Fetch only top 5 active sub-categories for a given parent
   */
  async getTopFiveSubCategories(): Promise<ServiceCategoryResponseDTO[]> {
    const records = await getTopSubCategories();
    return serviceCategoryMapper.toResponseList(records);
  },

  /* =============================
      WRITE OPERATIONS (ADMIN)
  ============================= */

  async create(
    data: CreateServiceCategoryDTO
  ): Promise<ServiceCategoryResponseDTO> {
    await requireAdmin();

    const record = await createServiceCategory(data as any);
    return serviceCategoryMapper.toResponse(record);
  },

  async update(
    id: string,
    data: UpdateServiceCategoryDTO
  ): Promise<ServiceCategoryResponseDTO | null> {
    await requireAdmin();

    const record = await updateServiceCategory(id, data as any);
    if (!record) return null;

    return serviceCategoryMapper.toResponse(record);
  },

  async remove(id: string): Promise<boolean> {
    await requireAdmin();
    return deleteServiceCategory(id);
  },
};
