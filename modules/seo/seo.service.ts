/***************************************************
 * File: modules/seo/seo.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Business rules for dashboard-managed page SEO entries
 *
 * Responsibilities:
 * - Normalise input (trim, dedupe keywords, canonical route form)
 * - Validate server-side (limits, enums, URL shapes, route registry)
 * - Enforce one record per route (no conflicting page mappings)
 *
 * Restrictions:
 * - Must NOT format responses or return DTOs
 * - Must NOT depend on Next.js APIs
 ***************************************************/

import { Types } from "mongoose";
import db from "@/lib/db";
import { AppError } from "@/lib/errors";
import { isManagedRoute, MANAGED_ROUTES } from "@/lib/seo/managedPages";
import { seoRepository } from "./seo.repository";
import {
  DEFAULT_META_ROBOTS,
  META_ROBOTS_OPTIONS,
  PAGE_SEO_STATUSES,
  SEO_LIMITS,
} from "./seo.constants";
import { MetaRobots, PageSeoRecord, PageSeoStatus } from "./seo.types";
import { CreatePageSeoDTO, UpdatePageSeoDTO } from "./seo.dto";

/* =====================================================
   Helpers
===================================================== */

function fail(message: string, code: string, context?: Record<string, unknown>): never {
  throw new AppError({ message, code, statusCode: 400, context });
}

function trimOrEmpty(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** "/About/" -> "/about", "about" -> "/about", "" -> "" */
export function normalizeRoute(value: unknown): string {
  let route = trimOrEmpty(value).toLowerCase();
  if (!route) return "";
  if (!route.startsWith("/")) route = `/${route}`;
  if (route.length > 1) route = route.replace(/\/+$/, "");
  return route;
}

/** Trim, drop empties, dedupe case-insensitively, keep first spelling. */
export function normalizeKeywords(values: unknown, exclude?: string): string[] {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();
  if (exclude) seen.add(exclude.toLowerCase());

  const out: string[] = [];
  for (const raw of values) {
    const v = trimOrEmpty(raw);
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/* =====================================================
   Normalisation
   Only keys present on the input are returned, so partial
   updates never blank out untouched fields.
===================================================== */
export function normalizePageSeoInput(
  data: UpdatePageSeoDTO
): Partial<PageSeoRecord> {
  const out: Partial<PageSeoRecord> = {};

  if (data.route !== undefined) out.route = normalizeRoute(data.route);
  if (data.title !== undefined) out.title = trimOrEmpty(data.title);
  if (data.description !== undefined) out.description = trimOrEmpty(data.description);
  if (data.heading !== undefined) out.heading = trimOrEmpty(data.heading);
  if (data.canonicalUrl !== undefined) out.canonicalUrl = trimOrEmpty(data.canonicalUrl);
  if (data.ogImage !== undefined) out.ogImage = trimOrEmpty(data.ogImage);
  if (data.metaRobots !== undefined) out.metaRobots = trimOrEmpty(data.metaRobots) as MetaRobots;
  if (data.status !== undefined) out.status = trimOrEmpty(data.status) as PageSeoStatus;

  if (data.primaryKeyword !== undefined) out.primaryKeyword = trimOrEmpty(data.primaryKeyword);

  if (data.secondaryKeywords !== undefined) {
    const primary = data.primaryKeyword !== undefined ? out.primaryKeyword : undefined;
    out.secondaryKeywords = normalizeKeywords(data.secondaryKeywords, primary);
  }

  return out;
}

/* =====================================================
   Validation
===================================================== */

/** Field-level checks on whatever keys are present. */
export function validatePageSeoFields(data: Partial<PageSeoRecord>): void {
  if (data.route !== undefined && !isManagedRoute(data.route)) {
    fail(
      `Route "${data.route}" is not a managed page. Allowed: ${MANAGED_ROUTES.join(", ")}`,
      "SEO_ROUTE_NOT_MANAGED",
      { route: data.route }
    );
  }

  if (data.title !== undefined && data.title.length > SEO_LIMITS.TITLE_MAX) {
    fail(`Title must be ${SEO_LIMITS.TITLE_MAX} characters or fewer`, "SEO_TITLE_TOO_LONG");
  }

  if (
    data.description !== undefined &&
    data.description.length > SEO_LIMITS.DESCRIPTION_MAX
  ) {
    fail(
      `Meta description must be ${SEO_LIMITS.DESCRIPTION_MAX} characters or fewer`,
      "SEO_DESCRIPTION_TOO_LONG"
    );
  }

  if (data.heading !== undefined && data.heading.length > SEO_LIMITS.HEADING_MAX) {
    fail(`Heading must be ${SEO_LIMITS.HEADING_MAX} characters or fewer`, "SEO_HEADING_TOO_LONG");
  }

  if (
    data.primaryKeyword !== undefined &&
    data.primaryKeyword.length > SEO_LIMITS.KEYWORD_MAX_LENGTH
  ) {
    fail(
      `Primary keyword must be ${SEO_LIMITS.KEYWORD_MAX_LENGTH} characters or fewer`,
      "SEO_KEYWORD_TOO_LONG"
    );
  }

  if (data.secondaryKeywords !== undefined) {
    if (data.secondaryKeywords.length > SEO_LIMITS.KEYWORDS_MAX_COUNT) {
      fail(
        `At most ${SEO_LIMITS.KEYWORDS_MAX_COUNT} secondary keywords are allowed`,
        "SEO_TOO_MANY_KEYWORDS"
      );
    }
    const tooLong = data.secondaryKeywords.find(
      (k) => k.length > SEO_LIMITS.KEYWORD_MAX_LENGTH
    );
    if (tooLong) {
      fail(
        `Keyword "${tooLong}" is longer than ${SEO_LIMITS.KEYWORD_MAX_LENGTH} characters`,
        "SEO_KEYWORD_TOO_LONG"
      );
    }
  }

  if (data.canonicalUrl) {
    if (
      data.canonicalUrl.length > SEO_LIMITS.URL_MAX_LENGTH ||
      !isAbsoluteHttpUrl(data.canonicalUrl)
    ) {
      fail(
        "Canonical URL must be a full http(s) URL, e.g. https://example.com/page",
        "SEO_CANONICAL_INVALID"
      );
    }
  }

  if (data.ogImage) {
    const ok =
      data.ogImage.length <= SEO_LIMITS.URL_MAX_LENGTH &&
      (data.ogImage.startsWith("/") || isAbsoluteHttpUrl(data.ogImage));
    if (!ok) {
      fail(
        "Social image must be a full http(s) URL or a site path starting with /",
        "SEO_OG_IMAGE_INVALID"
      );
    }
  }

  if (
    data.metaRobots !== undefined &&
    !META_ROBOTS_OPTIONS.includes(data.metaRobots)
  ) {
    fail("Invalid robots directive", "SEO_ROBOTS_INVALID", { metaRobots: data.metaRobots });
  }

  if (data.status !== undefined && !PAGE_SEO_STATUSES.includes(data.status)) {
    fail("Invalid status", "SEO_STATUS_INVALID", { status: data.status });
  }
}

/** Whole-record checks, run on the merged record before saving. */
export function validatePageSeoComplete(record: Partial<PageSeoRecord>): void {
  if (!record.route) {
    fail("Target page is required", "SEO_ROUTE_REQUIRED");
  }

  if (record.status === "published") {
    if (!record.title) {
      fail("A title is required before publishing", "SEO_TITLE_REQUIRED");
    }
    if (!record.description) {
      fail("A meta description is required before publishing", "SEO_DESCRIPTION_REQUIRED");
    }
  }
}

/* =====================================================
   CREATE
===================================================== */
export async function createPageSeo(
  data: CreatePageSeoDTO,
  updatedBy: string
): Promise<PageSeoRecord> {
  await db();

  const normalized = normalizePageSeoInput(data);
  validatePageSeoFields(normalized);

  const record: Partial<PageSeoRecord> = {
    title: "",
    description: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    heading: "",
    canonicalUrl: "",
    ogImage: "",
    metaRobots: DEFAULT_META_ROBOTS,
    status: "draft",
    ...normalized,
    updatedBy,
  };

  validatePageSeoComplete(record);

  const existing = await seoRepository.findByRoute(record.route as string);
  if (existing) {
    throw new AppError({
      message: `An SEO entry already exists for ${record.route}. Edit that entry instead.`,
      code: "SEO_ROUTE_DUPLICATE",
      statusCode: 409,
      context: { route: record.route },
    });
  }

  return seoRepository.create(record);
}

/* =====================================================
   READ
===================================================== */
export async function listPageSeo(filter: { status?: PageSeoStatus } = {}): Promise<PageSeoRecord[]> {
  await db();
  return seoRepository.findAll(filter);
}

export async function getPageSeoById(id: string): Promise<PageSeoRecord | null> {
  await db();
  if (!Types.ObjectId.isValid(id)) {
    fail("Invalid SEO entry id", "SEO_INVALID_ID", { id });
  }
  return seoRepository.findById(id);
}

export async function getPageSeoByRoute(route: string): Promise<PageSeoRecord | null> {
  await db();
  const normalized = normalizeRoute(route);
  if (!normalized) return null;
  return seoRepository.findByRoute(normalized);
}

/** Public-site read: only published entries are ever returned. */
export async function getPublishedPageSeoByRoute(route: string): Promise<PageSeoRecord | null> {
  const record = await getPageSeoByRoute(route);
  return record && record.status === "published" ? record : null;
}

/* =====================================================
   UPDATE
===================================================== */
export async function updatePageSeo(
  id: string,
  data: UpdatePageSeoDTO,
  updatedBy: string
): Promise<PageSeoRecord | null> {
  await db();

  if (!Types.ObjectId.isValid(id)) {
    fail("Invalid SEO entry id", "SEO_INVALID_ID", { id });
  }

  const existing = await seoRepository.findById(id);
  if (!existing) {
    throw new AppError({
      message: "SEO entry not found",
      code: "SEO_NOT_FOUND",
      statusCode: 404,
      context: { id },
    });
  }

  const normalized = normalizePageSeoInput(data);
  validatePageSeoFields(normalized);

  // Secondary keywords must never duplicate the (possibly unchanged) primary one.
  const primary = normalized.primaryKeyword ?? existing.primaryKeyword;
  if (normalized.secondaryKeywords !== undefined || normalized.primaryKeyword !== undefined) {
    normalized.secondaryKeywords = normalizeKeywords(
      normalized.secondaryKeywords ?? existing.secondaryKeywords,
      primary
    );
  }

  const merged: Partial<PageSeoRecord> = { ...existing, ...normalized };
  validatePageSeoComplete(merged);

  if (normalized.route && normalized.route !== existing.route) {
    const clash = await seoRepository.findByRoute(normalized.route);
    if (clash && clash._id.toString() !== id) {
      throw new AppError({
        message: `Another SEO entry already targets ${normalized.route}`,
        code: "SEO_ROUTE_DUPLICATE",
        statusCode: 409,
        context: { route: normalized.route, id },
      });
    }
  }

  return seoRepository.updateById(id, { ...normalized, updatedBy });
}

/* =====================================================
   DELETE
===================================================== */
export async function deletePageSeo(id: string): Promise<boolean> {
  await db();

  if (!Types.ObjectId.isValid(id)) {
    fail("Invalid SEO entry id", "SEO_INVALID_ID", { id });
  }

  return seoRepository.deleteById(id);
}
