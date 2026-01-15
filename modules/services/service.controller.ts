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

import { serviceService } from "./service.service";
import { serviceMapper } from "./service.mapper";

/* -------------------------------------
   Controller Object
------------------------------------- */
export const serviceController = {
  /**
   * Purpose:
   * - Get all published services (public API)
   */
  async getPublicServices() {
    const records = await serviceService.list({ publicOnly: true });
    return serviceMapper.toResponseList(records);
  },

  /**
   * Purpose:
   * - Get service by slug (public API)
   */
  async getServiceBySlug(slug: string) {
    const record = await serviceService.getBySlug(slug);
    if (!record) {
      return null;
    }
    return serviceMapper.toResponse(record);
  },
};
