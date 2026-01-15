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

import { serviceCategoryService } from "./service-category.service";
import { serviceCategoryMapper } from "./service-category.mapper";

export const serviceCategoryController = {
  /**
   * Get all active categories (public)
   */
  async getPublicCategories() {
    const records =
      await serviceCategoryService.list({ publicOnly: true });

    return serviceCategoryMapper.toResponseList(records);
  },
};
