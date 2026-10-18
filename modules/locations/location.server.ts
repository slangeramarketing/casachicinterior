/***************************************************
 * File: modules/locations/location.server.ts
 * Layer: Server Facade (Next.js adapter)
 *
 * Purpose:
 * - Single server-side entry point for the locations module
 *
 * Responsibilities:
 * - Auth & role checks for WRITE operations
 * - Call the service layer only, apply the mapper before returning
 * - Public reads never throw: a database problem renders the site
 *   without location links instead of breaking every page
 *
 * Restrictions:
 * - Must NOT access the repository directly
 * - Must NOT contain business logic
 ***************************************************/

import { cache } from "react";
import { getAuthUser } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import {
  createLocation,
  deleteLocation,
  getLocationById,
  getPublishedLocationBySlug,
  listLocations,
  updateLocation,
} from "./location.service";
import { locationMapper } from "./location.mapper";
import {
  CreateLocationDTO,
  LocationLinkDTO,
  LocationResponseDTO,
  UpdateLocationDTO,
} from "./location.dto";
import { LocationStatus } from "./location.types";

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

/** generateMetadata and the page body share one lookup per request. */
const getPublishedBySlugCached = cache(
  async (slug: string): Promise<LocationResponseDTO | null> => {
    try {
      const record = await getPublishedLocationBySlug(slug);
      return record ? locationMapper.toResponse(record) : null;
    } catch (err) {
      console.error(
        `[Locations] Lookup failed for /${slug}:`,
        err instanceof Error ? err.message : err
      );
      return null;
    }
  }
);

/** Footer, HTML sitemap and XML sitemap links; shared per request. */
const getPublishedLinksCached = cache(async (): Promise<LocationLinkDTO[]> => {
  try {
    const records = await listLocations({ status: "published" });
    return locationMapper.toLinkList(records);
  } catch (err) {
    console.error("[Locations] Published list unavailable:", err instanceof Error ? err.message : err);
    return [];
  }
});

export const locationServer = {
  /* ============ READ (admin) ============ */

  async getAll(filter: { status?: LocationStatus } = {}): Promise<LocationResponseDTO[]> {
    const records = await listLocations(filter);
    return locationMapper.toResponseList(records);
  },

  async getById(id: string): Promise<LocationResponseDTO | null> {
    const record = await getLocationById(id);
    return record ? locationMapper.toResponse(record) : null;
  },

  /* ============ READ (public site) ============ */

  getPublishedBySlug(slug: string): Promise<LocationResponseDTO | null> {
    return getPublishedBySlugCached(slug);
  },

  getPublishedLinks(): Promise<LocationLinkDTO[]> {
    return getPublishedLinksCached();
  },

  /* ============ WRITE (admin) ============ */

  async create(data: CreateLocationDTO): Promise<LocationResponseDTO> {
    const user = await requireAdmin();
    const record = await createLocation(data, user.userId);
    return locationMapper.toResponse(record);
  },

  async update(id: string, data: UpdateLocationDTO): Promise<LocationResponseDTO | null> {
    const user = await requireAdmin();
    const record = await updateLocation(id, data, user.userId);
    return record ? locationMapper.toResponse(record) : null;
  },

  async remove(id: string): Promise<boolean> {
    await requireAdmin();
    return deleteLocation(id);
  },
};
