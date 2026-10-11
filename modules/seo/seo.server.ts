/***************************************************
 * File: modules/seo/seo.server.ts
 * Layer: Server Facade (Next.js adapter)
 *
 * Purpose:
 * - Single server-side entry point for the SEO module
 *
 * Responsibilities:
 * - Auth & role checks for WRITE operations
 * - Call the service layer only, apply the mapper before returning
 * - Public reads must never throw: a database problem degrades to
 *   the page's hardcoded metadata instead of a broken page
 *
 * Restrictions:
 * - Must NOT access the repository directly
 * - Must NOT contain business logic
 ***************************************************/

import { cache } from "react";
import { getAuthUser } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import {
  createPageSeo,
  deletePageSeo,
  getPageSeoById,
  getPageSeoByRoute,
  getPublishedPageSeoByRoute,
  listPageSeo,
  updatePageSeo,
} from "./seo.service";
import { seoMapper } from "./seo.mapper";
import { CreatePageSeoDTO, PageSeoResponseDTO, UpdatePageSeoDTO } from "./seo.dto";
import { PageSeoStatus } from "./seo.types";

async function requireAdmin() {
  const user = await getAuthUser();

  if (!user || !["admin", "super_admin"].includes(user.role)) {
    throw new AppError({
      message: "Unauthorized: Admin access required",
      code: "AUTH_FORBIDDEN",
      statusCode: 403,
      context: { userId: user?.userId, role: user?.role },
    });
  }

  return user;
}

/**
 * Deduplicated per request with React cache(): generateMetadata and
 * the page body of the same route share one database lookup.
 */
const getPublishedForRouteCached = cache(
  async (route: string): Promise<PageSeoResponseDTO | null> => {
    try {
      const record = await getPublishedPageSeoByRoute(route);
      return record ? seoMapper.toResponse(record) : null;
    } catch (err) {
      console.error(
        `[SEO] Falling back to default metadata for ${route}:`,
        err instanceof Error ? err.message : err
      );
      return null;
    }
  }
);

export const seoServer = {
  /* ============ READ (admin) ============ */

  async getAll(filter: { status?: PageSeoStatus } = {}): Promise<PageSeoResponseDTO[]> {
    const records = await listPageSeo(filter);
    return seoMapper.toResponseList(records);
  },

  async getById(id: string): Promise<PageSeoResponseDTO | null> {
    const record = await getPageSeoById(id);
    return record ? seoMapper.toResponse(record) : null;
  },

  async getByRoute(route: string): Promise<PageSeoResponseDTO | null> {
    const record = await getPageSeoByRoute(route);
    return record ? seoMapper.toResponse(record) : null;
  },

  /* ============ READ (public site) ============ */

  getPublishedForRoute(route: string): Promise<PageSeoResponseDTO | null> {
    return getPublishedForRouteCached(route);
  },

  /* ============ WRITE (admin) ============ */

  async create(data: CreatePageSeoDTO): Promise<PageSeoResponseDTO> {
    const user = await requireAdmin();
    const record = await createPageSeo(data, user.userId);
    return seoMapper.toResponse(record);
  },

  async update(id: string, data: UpdatePageSeoDTO): Promise<PageSeoResponseDTO | null> {
    const user = await requireAdmin();
    const record = await updatePageSeo(id, data, user.userId);
    return record ? seoMapper.toResponse(record) : null;
  },

  async remove(id: string): Promise<boolean> {
    await requireAdmin();
    return deletePageSeo(id);
  },
};
