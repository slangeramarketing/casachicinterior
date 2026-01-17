"use server";

/***************************************************
 * File: app/(public)/actions/services.actions.ts
 * Layer: Server Action
 *
 * Purpose:
 * - Public-facing server action for Services
 *
 * Responsibilities:
 * - Call service server facade
 *
 * Restrictions:
 * - No business logic
 * - No DB access
 ***************************************************/

import { serviceServer } from "@/modules/services/service.server";

/**
 * Purpose:
 * - Fetch featured public services
 */
export async function getFeaturedServicesAction(limit = 5) {
  return serviceServer.getFeatured(limit);
}

/**
 * Purpose:
 * - Fetch all public services
 */
export async function getAllServicesAction() {
  return serviceServer.getAll();
}


/**
 * Purpose:
 * - Fetch public Service By Slug public
 */
export async function getServiceBySlugAction(slug: string) {
  return serviceServer.getBySlug(slug);
}
