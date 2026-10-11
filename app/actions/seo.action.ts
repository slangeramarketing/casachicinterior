"use server";

/***************************************************
 * File: app/actions/seo.action.ts
 * Layer: Server Action
 *
 * Purpose:
 * - Write operations for page SEO entries from the admin UI
 * - READ operations are called directly on seoServer in Server Pages
 *
 * Restrictions:
 * - NO business logic, NO DB access, NO auth logic (facade handles it)
 *
 * Result shape: { success, data | error }. Errors are returned, not
 * thrown, because Next.js strips thrown error messages from server
 * actions in production and the admin would only see a generic text.
 ***************************************************/

import { revalidatePath } from "next/cache";
import { seoServer } from "@/modules/seo/seo.server";
import { CreatePageSeoDTO, PageSeoResponseDTO, UpdatePageSeoDTO } from "@/modules/seo/seo.dto";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

/**
 * Public pages are rendered on demand, so a saved change is live on the
 * next request. revalidatePath is still called so the behaviour stays
 * correct if a page is ever switched to static or ISR rendering.
 */
function revalidateFor(route?: string | null) {
  revalidatePath("/admin/seo");
  revalidatePath("/sitemap.xml");
  if (route) revalidatePath(route);
}

export async function createPageSeoAction(
  data: CreatePageSeoDTO
): Promise<ActionResult<PageSeoResponseDTO>> {
  try {
    const result = await seoServer.create(data);
    revalidateFor(result.route);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: errorMessage(err, "Failed to create SEO entry") };
  }
}

export async function updatePageSeoAction(
  id: string,
  data: UpdatePageSeoDTO,
  previousRoute?: string
): Promise<ActionResult<PageSeoResponseDTO>> {
  try {
    const result = await seoServer.update(id, data);
    if (!result) return { success: false, error: "SEO entry not found" };
    revalidateFor(result.route);
    if (previousRoute && previousRoute !== result.route) revalidatePath(previousRoute);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: errorMessage(err, "Failed to update SEO entry") };
  }
}

export async function deletePageSeoAction(
  id: string,
  route?: string
): Promise<ActionResult<boolean>> {
  try {
    const removed = await seoServer.remove(id);
    if (!removed) return { success: false, error: "SEO entry not found" };
    revalidateFor(route);
    return { success: true, data: true };
  } catch (err) {
    return { success: false, error: errorMessage(err, "Failed to delete SEO entry") };
  }
}
