"use server";

/***************************************************
 * File: app/admin/actions/services.actions.ts
 * Layer: Server Action
 *
 * Purpose:
 * - Admin-facing server actions for Service module
 *
 * Responsibilities:
 * - Act as the ONLY entry point from UI (pages / clients)
 * - Call serviceServer facade
 *
 * Restrictions:
 * - NO business logic
 * - NO DB access
 * - NO auth logic (handled by server facade)
 ***************************************************/

/***************************************************
 * File: app/admin/actions/services.actions.ts
 * Layer: Server Action
 ***************************************************/

import { serviceServer } from "@/modules/services/service.server";
import {
  CreateServiceDTO,
  UpdateServiceDTO,
} from "@/modules/services/service.dto";
import { revalidatePath } from "next/cache";

/**
 * Create a new service and refresh the list
 */
export async function createServiceAction(data: CreateServiceDTO) {
  try {
    const result = await serviceServer.create(data);
    
    // Refresh the admin list and public pages
    revalidatePath("/admin/services");
    revalidatePath("/services");
    
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Could not create service");
  }
}

/**
 * Update an existing service
 */
export async function updateServiceAction(id: string, data: UpdateServiceDTO) {
  try {
    const result = await serviceServer.update(id, data);
    
    // Specific path revalidation
    revalidatePath("/admin/services");
    revalidatePath(`/services/${result?.slug}`);
    revalidatePath("/services");

    return result;
  } catch (error: any) {
    throw new Error(error.message || "Update failed");
  }
}

/**
 * Delete a service
 */
export async function deleteServiceAction(id: string) {
  try {
    const success = await serviceServer.remove(id);
    
    if (success) {
      revalidatePath("/admin/services");
      revalidatePath("/services");
    }
    
    return success;
  } catch (error: any) {
    throw new Error("Delete operation failed");
  }
}