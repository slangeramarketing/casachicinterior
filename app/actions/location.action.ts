"use server";

/***************************************************
 * File: app/actions/location.action.ts
 * Layer: Server Action
 *
 * Purpose:
 * - Write operations for location pages from the admin UI
 * - READ operations are called directly on locationServer in Server Pages
 *
 * Restrictions:
 * - NO business logic, NO DB access, NO auth logic (facade handles it)
 *
 * Result shape: { success, data | error }. Errors are returned, not
 * thrown, because Next.js strips thrown error messages from server
 * actions in production and the admin would only see a generic text.
 ***************************************************/

import { revalidatePath } from "next/cache";
import { locationServer } from "@/modules/locations/location.server";
import {
  CreateLocationDTO,
  LocationResponseDTO,
  UpdateLocationDTO,
} from "@/modules/locations/location.dto";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

/**
 * Public pages render on demand, so a saved change is live on the next
 * request. Paths are still revalidated so behaviour stays correct if any
 * of them is ever switched to static or ISR rendering. The footer and
 * HTML sitemap list published locations, hence the layout revalidation.
 */
function revalidateFor(slug?: string | null) {
  revalidatePath("/admin/locations");
  revalidatePath("/sitemap.xml");
  revalidatePath("/site-map");
  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/${slug}`);
}

export async function createLocationAction(
  data: CreateLocationDTO
): Promise<ActionResult<LocationResponseDTO>> {
  try {
    const result = await locationServer.create(data);
    revalidateFor(result.slug);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: errorMessage(err, "Failed to create location page") };
  }
}

export async function updateLocationAction(
  id: string,
  data: UpdateLocationDTO,
  previousSlug?: string
): Promise<ActionResult<LocationResponseDTO>> {
  try {
    const result = await locationServer.update(id, data);
    if (!result) return { success: false, error: "Location page not found" };
    revalidateFor(result.slug);
    if (previousSlug && previousSlug !== result.slug) revalidatePath(`/${previousSlug}`);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: errorMessage(err, "Failed to update location page") };
  }
}

export async function deleteLocationAction(
  id: string,
  slug?: string
): Promise<ActionResult<boolean>> {
  try {
    const removed = await locationServer.remove(id);
    if (!removed) return { success: false, error: "Location page not found" };
    revalidateFor(slug);
    return { success: true, data: true };
  } catch (err) {
    return { success: false, error: errorMessage(err, "Failed to delete location page") };
  }
}
