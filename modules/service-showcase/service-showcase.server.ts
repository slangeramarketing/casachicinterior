/***************************************************
 * File: service-showcase.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Next.js server adapter for Service Showcase
 *
 * Responsibilities:
 * - Auth & role checks
 * - Call service layer only
 * - Apply mapper before returning
 *
 * Restrictions:
 * - Must NOT access repository directly
 * - Must NOT contain business logic
 ***************************************************/

import {
  createServiceShowcase,
  updateServiceShowcase,
  removeServiceShowcase,
  getServiceShowcaseById,
  getServiceShowcasesByService,
  listServiceShowcases,
} from "./service-showcase.service";

import { serviceShowcaseMapper } from "./service-showcase.mapper";
import {
  CreateServiceShowcaseDTO,
  UpdateServiceShowcaseDTO,
} from "./service-showcase.dto";

import { getAuthUser } from "@/lib/auth";

export const serviceShowcaseServer = {
  /* =============================
     READ
  ============================= */

  async getAll() {
    const records = await listServiceShowcases();
    return serviceShowcaseMapper.toResponseList(records);
  },

  async getById(id: string) {
    const record = await getServiceShowcaseById(id);
    return record
      ? serviceShowcaseMapper.toResponse(record)
      : null;
  },

  async getByService(serviceId: string) {
    const records =
      await getServiceShowcasesByService(serviceId);

    return serviceShowcaseMapper.toResponseList(records);
  },

  /* =============================
     WRITE (ADMIN)
  ============================= */

  async create(data: CreateServiceShowcaseDTO) {
    const user = await getAuthUser();

    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await createServiceShowcase(data as any);
    return serviceShowcaseMapper.toResponse(record);
  },

  async update(
    id: string,
    data: UpdateServiceShowcaseDTO
  ) {
    const user = await getAuthUser();

    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await updateServiceShowcase(id, data as any);
    if (!record) return null;

    return serviceShowcaseMapper.toResponse(record);
  },

  async remove(id: string) {
    const user = await getAuthUser();

    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    return removeServiceShowcase(id);
  },
};
