/***************************************************
 * File: modules/service-categories/service-category.controller.ts
 * Layer: Controller
 *
 * Purpose:
 * - Exposes public APIs for Service Categories
 *
 * Responsibilities:
 * - Handle request/response
 * - Call service layer
 * - Apply mapper before returning response
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT access database directly
 *
 * Notes:
 * - Exports a stateless object with methods
 ***************************************************/


import { serviceCategoryMapper } from "./service-category.mapper";
import { listServiceCategories } from "./service-category.service";

export const serviceCategoryController = {
  /**
   * Get all active categories (public)
   */
  async getPublicCategories() {
    const records =
      await listServiceCategories({ publicOnly: true });

    return serviceCategoryMapper.toResponseList(records);
  },
};
