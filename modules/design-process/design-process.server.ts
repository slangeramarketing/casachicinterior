/***************************************************
 * File: modules/design-process/design-process.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Next.js server adapter for DesignProcess module
 *
 * Responsibilities:
 * - Auth & role checks (WRITE operations)
 * - Call service layer functions
 * - Apply mapper before returning response
 *
 * Restrictions:
 * - Must NOT access repository directly
 * - Must NOT contain business logic
 * - Must return DTOs only
 ***************************************************/

import { getAuthUser } from "@/lib/auth";
import {
  createDesignProcessService,
  updateDesignProcessService,
  getDesignProcessByIdService,
  listDesignProcessesService,
  removeDesignProcessService,
} from "./design-process.service";
import { designProcessMapper } from "./design-process.mapper";
import {
  CreateDesignProcessDTO,
  UpdateDesignProcessDTO,
} from "./design-process.dto";

export const designProcessServer = {
  /* =========================
     READ OPERATIONS
  ========================= */

  /**
   * Get all design process steps (admin)
   */
  async getAll(options?: {
    serviceId?: string;
    activeOnly?: boolean;
  }) {
    const records = await listDesignProcessesService(
      options
    );
    return designProcessMapper.toResponseList(records);
  },

  /**
   * Get design process by ID
   */
  async getById(id: string) {
    const record =
      await getDesignProcessByIdService(id);

    if (!record) return null;

    return designProcessMapper.toResponse(record);
  },

  /**
   * Get process steps for a service (public/admin)
   */
  async getByServiceId(
    serviceId: string,
    publicOnly = false
  ) {
    const records =
      await listDesignProcessesService({
        serviceId,
        activeOnly: publicOnly,
      });

    return designProcessMapper.toResponseList(records);
  },

  /* =========================
     WRITE OPERATIONS (ADMIN)
  ========================= */

  /**
   * Create design process step
   */
  async create(data: CreateDesignProcessDTO) {
    const user = await getAuthUser();

    if (
      !user ||
      (user.role !== "admin" &&
        user.role !== "super_admin")
    ) {
      throw new Error("Unauthorized");
    }

    const record =
      await createDesignProcessService(data);

    return designProcessMapper.toResponse(record);
  },

  /**
   * Update design process step
   */
  async update(
    id: string,
    data: UpdateDesignProcessDTO
  ) {
    const user = await getAuthUser();

    if (
      !user ||
      (user.role !== "admin" &&
        user.role !== "super_admin")
    ) {
      throw new Error("Unauthorized");
    }

    const record =
      await updateDesignProcessService(id, data as any);

    if (!record) return null;

    return designProcessMapper.toResponse(record);
  },

  /**
   * Delete design process step
   */
  async remove(id: string) {
    const user = await getAuthUser();

    if (
      !user ||
      (user.role !== "admin" &&
        user.role !== "super_admin")
    ) {
      throw new Error("Unauthorized");
    }

    return removeDesignProcessService(id);
  },
};
