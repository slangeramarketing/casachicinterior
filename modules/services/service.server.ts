/***************************************************
 * File: modules/services/service.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Acts as Next.js–specific server adapter for Service module
 *
 * Responsibilities:
 * - Perform auth & role checks for WRITE operations
 * - Call service layer only
 * - Apply mapper before returning data
 *
 * Restrictions:
 * - Must NOT access repository directly
 * - Must NOT contain business logic
 * - Must NOT return raw DB records
 *
 * Notes:
 * - This file exports a stateless object with methods
 ***************************************************/

import { createService, deleteService, getServiceById, getServiceBySlug, listServices,updateService } from "./service.service";
import { serviceMapper } from "./service.mapper";
import { CreateServiceDTO, UpdateServiceDTO } from "./service.dto";
import { getAuthUser } from "@/lib/auth";

/* -------------------------------------
   Server Facade Object
------------------------------------- */
export const serviceServer = {
  /* =============================
     READ OPERATIONS
  ============================= */

  /**
   * Purpose:
   * - Get all services (admin)
   */
  async getAll() {
    const records = await listServices();
    return serviceMapper.toResponseList(records);
  },

  /* =============================
   READ OPERATIONS
============================= */

/**
 * Get FEATURED services (public)
 * Used for menu / homepage
 */
async getFeatured(limit = 5) {
  const records = await listServices({
    publicOnly: true,
    featured: true,
    limit,
  });

  return serviceMapper.toResponseList(records);
},


  /**
   * Purpose:
   * - Get service by ID (admin)
   */
  async getById(id: string) {
    const record = await getServiceById(id);
    if (!record) return null;
    return serviceMapper.toResponse(record);
  },

  /**
   * Get published services (public)
   */
  async getPublic(options?: {
    categoryId?: string;
    featured?: boolean;
  }) {
    const records = await listServices({
      publicOnly: true,
      categoryId: options?.categoryId,
      featured: options?.featured,
    });

    return serviceMapper.toResponseList(records);
  },


  /**
   * Purpose:
   * - Get service by slug (public)
   */
  async getBySlug(slug: string) {
    const record = await getServiceBySlug(slug);
    if (!record) return null;
    return serviceMapper.toResponse(record);
  },

  /* =============================
     WRITE OPERATIONS (ADMIN ONLY)
  ============================= */

  /**
   * Purpose:
   * - Create service
   */
  async create(data: CreateServiceDTO) {
    const user = await getAuthUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await createService(data as any);
    return serviceMapper.toResponse(record);
  },

  /**
   * Purpose:
   * - Update service
   */
  async update(id: string, data: UpdateServiceDTO) {
    const user = await getAuthUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await updateService(id, data as any);
    if (!record) return null;

    return serviceMapper.toResponse(record);
  },

  /**
   * Purpose:
   * - Delete service
   */
  async remove(id: string) {
    const user = await getAuthUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    return deleteService(id);
  },
};
