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

import { serviceServer } from "@/modules/services/service.server";
import {
  CreateServiceDTO,
  UpdateServiceDTO,
} from "@/modules/services/service.dto";

/* ================================
   READ
================================ */

/**
 * Get all services (admin)
 */
export async function getAllServicesAction() {
  return serviceServer.getAll();
}

/**
 * Get service by ID (admin)
 */
export async function getServiceByIdAction(id: string) {
  return serviceServer.getById(id);
}

/* ================================
   WRITE (ADMIN ONLY)
================================ */

/**
 * Create service
 */
export async function createServiceAction(
  data: CreateServiceDTO
) {
  return serviceServer.create(data);
}

/**
 * Update service
 */
export async function updateServiceAction(
  id: string,
  data: UpdateServiceDTO
) {
  return serviceServer.update(id, data);
}

/**
 * Delete service
 */
export async function deleteServiceAction(id: string) {
  return serviceServer.remove(id);
}
