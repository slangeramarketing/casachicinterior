"use server";
import { CreateServiceCategoryDTO, UpdateServiceCategoryDTO } from "@/modules/service-category/service-category.dto";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";
/***************************************************
 * File: app/admin/actions/service-categories.actions.ts
 * Layer: Server Action
 *
 * Purpose:
 * - Admin-facing server actions for ServiceCategory
 *
 * Responsibilities:
 * - Act as the ONLY entry point from admin UI
 * - Call serviceCategoryServer facade
 *
 * Restrictions:
 * - NO business logic
 * - NO DB access
 * - NO auth logic (handled in server facade)
 ***************************************************/




/***************************************************
 * File: app/admin/actions/service-categories.actions.ts
 * Layer: Server Action
 * * Purpose:
 * - Handle ONLY Write operations (Mutations) from Client Components.
 * - READ operations are called directly from serviceCategoryServer in Server Components.
 ***************************************************/

import { revalidatePath } from "next/cache";

/* =====================================================
    WRITE OPERATIONS (ADMIN ONLY)
   ===================================================== */

/**
 * Create service category
 */
export async function createServiceCategoryAction(
  data: CreateServiceCategoryDTO
) {
  try {
    const result = await serviceCategoryServer.create(data);
    
    // Purging cache for both Admin and Public views
    revalidatePath("/admin/service-categories");
    revalidatePath("/services"); // Category change reflects in main service pages
    
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create category");
  }
}

/**
 * Update service category
 */
export async function updateServiceCategoryAction(
  id: string,
  data: UpdateServiceCategoryDTO
) {
  try {
    const result = await serviceCategoryServer.update(id, data);
    
    revalidatePath("/admin/service-categories");
    revalidatePath("/services");
    if (result?.slug) {
      revalidatePath(`/services/${result.slug}`);
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update category");
  }
}

/**
 * Delete service category
 */
export async function deleteServiceCategoryAction(id: string) {
  try {
    const success = await serviceCategoryServer.remove(id);
    
    if (success) {
      revalidatePath("/admin/service-categories");
      revalidatePath("/services");
    }
    
    return success;
  } catch (error: any) {
    // Service layer se aane wali custom errors (e.g. "Has Children") yahan catch hongi
    throw new Error(error.message || "Failed to delete category");
  }
}