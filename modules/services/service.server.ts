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
  /***************************************************
 * File: modules/services/service.server.ts
 * Layer: Server Facade (Adapter for Next.js)
 ***************************************************/

import {
  createService,
  deleteService,
  getServiceById,
  getServiceBySlug,
  listServices,
  updateService,
} from "./service.service";
import { serviceMapper } from "./service.mapper";
import {
  CreateServiceDTO,
  UpdateServiceDTO,
  ServiceResponseDTO,
} from "./service.dto";
import { getAuthUser } from "@/lib/auth";
import { AppError } from "@/lib/errors";

/* -------------------------------------
   Server Facade Object
------------------------------------- */
export const serviceServer = {
  /* =============================
      READ OPERATIONS
  ============================= */

  async getAll(): Promise<ServiceResponseDTO[]> {
    try {
      const records = await listServices();
      return serviceMapper.toResponseList(records);
    } catch (err) {
      throw err; // 👈 AppError / DatabaseError 그대로 ऊपर जाने दो
    }
  },

  async getFeatured(limit = 5): Promise<ServiceResponseDTO[]> {
    try {
      const records = await listServices({
        publicOnly: true,
        featured: true,
        limit,
      });
      return serviceMapper.toResponseList(records);
    } catch (err) {
      throw err;
    }
  },

  async getPublic(options?: {
    categoryId?: string;
    featured?: boolean;
  }): Promise<ServiceResponseDTO[]> {
    try {
      const records = await listServices({
        publicOnly: true,
        categoryId: options?.categoryId,
        featured: options?.featured,
      });
      return serviceMapper.toResponseList(records);
    } catch (err) {
      throw err;
    }
  },

  async getById(id: string): Promise<ServiceResponseDTO | null> {
    try {
      const record = await getServiceById(id);
      if (!record) return null;
      return serviceMapper.toResponse(record);
    } catch (err) {
      throw err;
    }
  },

  async getBySlug(slug: string): Promise<ServiceResponseDTO | null> {
    try {
      const record = await getServiceBySlug(slug);
      if (!record) return null;
      return serviceMapper.toResponse(record);
    } catch (err) {
      throw err;
    }
  },

  async getByCategory(
    categoryId: string
  ): Promise<ServiceResponseDTO[]> {
    const records = await listServices({
      categoryId,
      publicOnly: true,
    });

    return serviceMapper.toResponseList(records);
  },


  /* =============================
      WRITE OPERATIONS (ADMIN)
  ============================= */

  async create(data: CreateServiceDTO): Promise<ServiceResponseDTO> {
    const user = await getAuthUser();

    if (!user || !["admin", "super_admin"].includes(user.role)) {
      throw new AppError({
        message: "Unauthorized: Admin access required",
        code: "UNAUTHORIZED",
        statusCode: 403,
        context: { userId: user?.userId, role: user?.role },
      });
    }

    try {
      const record = await createService(data as any);
      return serviceMapper.toResponse(record as any);
    } catch (err) {
      throw err;
    }
  },

  async update(
    id: string,
    data: UpdateServiceDTO
  ): Promise<ServiceResponseDTO | null> {
    const user = await getAuthUser();

    if (!user || !["admin", "super_admin"].includes(user.role)) {
      throw new AppError({
        message: "Unauthorized",
        code: "UNAUTHORIZED",
        statusCode: 403,
        context: { userId: user?.userId, role: user?.role },
      });
    }

    try {
      const record = await updateService(id, data as any);
      if (!record) return null;
      return serviceMapper.toResponse(record);
    } catch (err) {
      throw err;
    }
  },

  async remove(id: string): Promise<boolean> {
    const user = await getAuthUser();

    if (!user || !["admin", "super_admin"].includes(user.role)) {
      throw new AppError({
        message: "Unauthorized",
        code: "UNAUTHORIZED",
        statusCode: 403,
        context: { userId: user?.userId, role: user?.role },
      });
    }

    try {
      return await deleteService(id);
    } catch (err) {
      throw err;
    }
  },
};
