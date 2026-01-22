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

/***************************************************
 * File: modules/services/service.controller.ts
 * Layer: Controller
 ***************************************************/

import { serviceMapper } from "./service.mapper";
import { getServiceBySlug, listServices } from "./service.service";
import { ServiceResponseDTO } from "./service.dto";

/* -------------------------------------
   Controller Object
------------------------------------- */
export const serviceController = {
  /**
   * Purpose:
   * - Get all published services for the public website.
   * - Supports optional filtering by category or featured status.
   */
  async getPublicServices(options?: {
    categoryId?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<ServiceResponseDTO[]> {
    const records = await listServices({
      publicOnly: true,
      categoryId: options?.categoryId,
      featured: options?.featured,
      limit: options?.limit,
    });

    return serviceMapper.toResponseList(records);
  },

  /**
   * Purpose:
   * - Get featured services specifically for Home/Landing pages.
   */
  async getFeaturedServices(limit: number = 6): Promise<ServiceResponseDTO[]> {
    const records = await listServices({
      publicOnly: true,
      featured: true,
      limit,
    });

    return serviceMapper.toResponseList(records);
  },

  /**
   * Purpose:
   * - Get a single service detail by slug for the dynamic service page.
   */
  async getServiceBySlug(slug: string): Promise<ServiceResponseDTO | null> {
    const record = await getServiceBySlug(slug);
    
    if (!record) {
      return null;
    }

    return serviceMapper.toResponse(record);
  },
};