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

/***************************************************
 * File: modules/service-categories/service-category.controller.ts
 * Layer: Controller
 ***************************************************/

import { serviceCategoryMapper } from "./service-category.mapper";
import { listServiceCategories, getServiceCategoryById } from "./service-category.service";
import { ServiceCategoryResponseDTO } from "./service-category.dto";

export const serviceCategoryController = {
  /**
   * Purpose:
   * - Get all active categories for public view.
   * - Supports filtering by parentId (e.g., fetch only top-level if parentId is null).
   */
  async getPublicCategories(options?: {
    parentId?: string | null;
  }): Promise<ServiceCategoryResponseDTO[]> {
    const records = await listServiceCategories({ 
      publicOnly: true,
      parentId: options?.parentId 
    });

    return serviceCategoryMapper.toResponseList(records);
  },

  /**
   * Purpose:
   * - Get a single category by its ID (Publicly).
   * - Useful for category landing pages or breadcrumbs.
   */
  async getCategoryById(id: string): Promise<ServiceCategoryResponseDTO | null> {
    const record = await getServiceCategoryById(id);
    
    // Safety check: Public user should not see inactive categories
    if (!record || record.status !== "active") {
      return null;
    }

    return serviceCategoryMapper.toResponse(record);
  }
};