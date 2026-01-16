/***************************************************
 * File: modules/services/service.controller.ts
 * Layer: Controller
 *
 * Purpose:
 * - Exposes public APIs for Service module
 *
 * Responsibilities:
 * - Handle HTTP request / response
 * - Call service layer
 * - Apply mapper before returning response
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT access database directly
 * - Must NOT perform authorization logic
 *
 * Notes:
 * - This file exports a stateless object with methods
 ***************************************************/


import { serviceMapper } from "./service.mapper";
import { getServiceBySlug, listServices } from "./service.service";

/* -------------------------------------
   Controller Object
------------------------------------- */
export const serviceController = {
  /**
   * Purpose:
   * - Get all published services (public API)
   */
  async getPublicServices() {
    const records = await listServices({ publicOnly: true });
    return serviceMapper.toResponseList(records);
  },

  /**
   * Purpose:
   * - Get service by slug (public API)
   */
  async getServiceBySlug(slug: string) {
    const record = await getServiceBySlug(slug);
    if (!record) {
      return null;
    }
    return serviceMapper.toResponse(record);
  },
};
