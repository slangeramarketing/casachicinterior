/***************************************************
 * File: modules/locations/location.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Business rules for location landing pages
 *
 * Responsibilities:
 * - Normalise input (slug form, trimmed text, de-duplicated lists)
 * - Validate server-side (limits, enums, reserved slugs, URL shapes)
 * - Enforce the "genuinely local content" minimums before publishing
 * - Enforce one page per slug
 *
 * Restrictions:
 * - Must NOT format responses or return DTOs
 * - Must NOT depend on Next.js APIs
 ***************************************************/

import { Types } from "mongoose";
import db from "@/lib/db";
import { AppError } from "@/lib/errors";
import { slugify, SLUG_PATTERN } from "@/lib/utils/slugify";
import { locationRepository } from "./location.repository";
import {
  DEFAULT_LOCATION_CTA_LINK,
  DEFAULT_LOCATION_CTA_TEXT,
  DEFAULT_LOCATION_META_ROBOTS,
  LOCATION_LIMITS,
  LOCATION_META_ROBOTS_OPTIONS,
  LOCATION_STATUSES,
  RESERVED_LOCATION_SLUGS,
} from "./location.constants";
import {
  LocationBudgetRecord,
  LocationFaqRecord,
  LocationMetaRobots,
  LocationProjectRecord,
  LocationRecord,
  LocationStatus,
  LocationTestimonialRecord,
} from "./location.types";
import { CreateLocationDTO, UpdateLocationDTO } from "./location.dto";

/* =====================================================
   Helpers
===================================================== */

function fail(message: string, code: string, context?: Record<string, unknown>): never {
  throw new AppError({ message, code, statusCode: 400, context });
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Trim, drop empties, dedupe case-insensitively, keep first spelling. */
export function normalizeList(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const v = text(raw);
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

function normalizeServiceIds(values: unknown): string[] {
  return normalizeList(values).filter((id) => Types.ObjectId.isValid(id));
}

function normalizeProjects(values: unknown): LocationProjectRecord[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((p) => ({
      title: text(p?.title),
      locality: text(p?.locality),
      flatSize: text(p?.flatSize),
      scope: text(p?.scope),
      description: text(p?.description),
      image: text(p?.image),
    }))
    .filter((p) => p.title);
}

function normalizeBudgets(values: unknown): LocationBudgetRecord[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((b) => ({ label: text(b?.label), range: text(b?.range) }))
    .filter((b) => b.label && b.range);
}

function normalizeTestimonials(values: unknown): LocationTestimonialRecord[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((t) => {
      const rating = Number(t?.rating);
      return {
        name: text(t?.name),
        locality: text(t?.locality),
        text: text(t?.text),
        rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5,
      };
    })
    .filter((t) => t.name && t.text);
}

function normalizeFaqs(values: unknown): LocationFaqRecord[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((f) => ({ question: text(f?.question), answer: text(f?.answer) }))
    .filter((f) => f.question && f.answer);
}

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isSitePathOrUrl(value: string): boolean {
  return value.startsWith("/") || isAbsoluteHttpUrl(value);
}

export function isReservedLocationSlug(slug: string): boolean {
  return RESERVED_LOCATION_SLUGS.includes(slug) || slug.startsWith("_") || slug.includes(".");
}

/* =====================================================
   Normalisation
   Only keys present on the input are returned, so partial
   updates never blank out untouched fields.
===================================================== */
export function normalizeLocationInput(data: UpdateLocationDTO): Partial<LocationRecord> {
  const out: Partial<LocationRecord> = {};

  if (data.slug !== undefined) out.slug = slugify(text(data.slug));
  if (data.areaName !== undefined) out.areaName = text(data.areaName);
  if (data.title !== undefined) out.title = text(data.title);
  if (data.intro !== undefined) out.intro = text(data.intro);
  if (data.heroImage !== undefined) out.heroImage = text(data.heroImage);

  if (data.localities !== undefined) out.localities = normalizeList(data.localities);
  if (data.serviceIds !== undefined) out.serviceIds = normalizeServiceIds(data.serviceIds);
  if (data.projects !== undefined) out.projects = normalizeProjects(data.projects);
  if (data.budgets !== undefined) out.budgets = normalizeBudgets(data.budgets);
  if (data.testimonials !== undefined) out.testimonials = normalizeTestimonials(data.testimonials);
  if (data.faqs !== undefined) out.faqs = normalizeFaqs(data.faqs);

  if (data.ctaText !== undefined) out.ctaText = text(data.ctaText) || DEFAULT_LOCATION_CTA_TEXT;
  if (data.ctaLink !== undefined) out.ctaLink = text(data.ctaLink) || DEFAULT_LOCATION_CTA_LINK;

  if (data.metaTitle !== undefined) out.metaTitle = text(data.metaTitle);
  if (data.metaDescription !== undefined) out.metaDescription = text(data.metaDescription);
  if (data.keywords !== undefined) out.keywords = normalizeList(data.keywords);
  if (data.metaRobots !== undefined) {
    out.metaRobots = (text(data.metaRobots) || DEFAULT_LOCATION_META_ROBOTS) as LocationMetaRobots;
  }
  if (data.status !== undefined) out.status = text(data.status) as LocationStatus;

  return out;
}

/* =====================================================
   Validation
===================================================== */

/** Field-level checks on whatever keys are present. */
export function validateLocationFields(data: Partial<LocationRecord>): void {
  const L = LOCATION_LIMITS;

  if (data.slug !== undefined) {
    if (!data.slug) fail("Slug is required", "LOCATION_SLUG_REQUIRED");
    if (data.slug.length > L.SLUG_MAX) fail(`Slug must be ${L.SLUG_MAX} characters or fewer`, "LOCATION_SLUG_TOO_LONG");
    if (!SLUG_PATTERN.test(data.slug)) {
      fail("Slug may contain only lower-case letters, digits and single hyphens", "LOCATION_SLUG_INVALID", { slug: data.slug });
    }
    if (isReservedLocationSlug(data.slug)) {
      fail(`"${data.slug}" is already used by another page on the site`, "LOCATION_SLUG_RESERVED", { slug: data.slug });
    }
  }

  if (data.areaName !== undefined) {
    if (!data.areaName) fail("Area name is required", "LOCATION_AREA_REQUIRED");
    if (data.areaName.length > L.AREA_NAME_MAX) fail(`Area name must be ${L.AREA_NAME_MAX} characters or fewer`, "LOCATION_AREA_TOO_LONG");
  }

  if (data.title !== undefined) {
    if (!data.title) fail("Page heading is required", "LOCATION_TITLE_REQUIRED");
    if (data.title.length > L.TITLE_MAX) fail(`Page heading must be ${L.TITLE_MAX} characters or fewer`, "LOCATION_TITLE_TOO_LONG");
  }

  if (data.intro !== undefined && data.intro.length > L.INTRO_MAX) {
    fail(`Introduction must be ${L.INTRO_MAX} characters or fewer`, "LOCATION_INTRO_TOO_LONG");
  }

  if (data.heroImage !== undefined && data.heroImage && !isSitePathOrUrl(data.heroImage)) {
    fail("Hero image must be a full URL or a path starting with /", "LOCATION_HERO_IMAGE_INVALID");
  }

  if (data.localities !== undefined) {
    if (data.localities.length > L.LOCALITIES_MAX) fail(`At most ${L.LOCALITIES_MAX} localities`, "LOCATION_TOO_MANY_LOCALITIES");
    if (data.localities.some((l) => l.length > L.LOCALITY_MAX_LENGTH)) {
      fail(`Each locality must be ${L.LOCALITY_MAX_LENGTH} characters or fewer`, "LOCATION_LOCALITY_TOO_LONG");
    }
  }

  if (data.serviceIds !== undefined && data.serviceIds.length > L.SERVICES_MAX) {
    fail(`At most ${L.SERVICES_MAX} services`, "LOCATION_TOO_MANY_SERVICES");
  }

  if (data.projects !== undefined) {
    if (data.projects.length > L.PROJECTS_MAX) fail(`At most ${L.PROJECTS_MAX} projects`, "LOCATION_TOO_MANY_PROJECTS");
    for (const p of data.projects) {
      if (p.title.length > L.SHORT_TEXT_MAX) fail(`Project titles must be ${L.SHORT_TEXT_MAX} characters or fewer`, "LOCATION_PROJECT_TITLE_TOO_LONG");
      if (p.description.length > L.LONG_TEXT_MAX) fail(`Project descriptions must be ${L.LONG_TEXT_MAX} characters or fewer`, "LOCATION_PROJECT_TEXT_TOO_LONG");
      if (p.image && !isSitePathOrUrl(p.image)) fail("Project images must be a full URL or a path starting with /", "LOCATION_PROJECT_IMAGE_INVALID");
    }
  }

  if (data.budgets !== undefined && data.budgets.length > L.BUDGETS_MAX) {
    fail(`At most ${L.BUDGETS_MAX} budget rows`, "LOCATION_TOO_MANY_BUDGETS");
  }

  if (data.testimonials !== undefined) {
    if (data.testimonials.length > L.TESTIMONIALS_MAX) fail(`At most ${L.TESTIMONIALS_MAX} testimonials`, "LOCATION_TOO_MANY_TESTIMONIALS");
    if (data.testimonials.some((t) => t.text.length > L.LONG_TEXT_MAX)) {
      fail(`Testimonials must be ${L.LONG_TEXT_MAX} characters or fewer`, "LOCATION_TESTIMONIAL_TOO_LONG");
    }
  }

  if (data.faqs !== undefined) {
    if (data.faqs.length > L.FAQS_MAX) fail(`At most ${L.FAQS_MAX} FAQs`, "LOCATION_TOO_MANY_FAQS");
    if (data.faqs.some((f) => f.answer.length > L.LONG_TEXT_MAX)) {
      fail(`FAQ answers must be ${L.LONG_TEXT_MAX} characters or fewer`, "LOCATION_FAQ_TOO_LONG");
    }
  }

  if (data.ctaText !== undefined && data.ctaText.length > L.CTA_TEXT_MAX) {
    fail(`Button text must be ${L.CTA_TEXT_MAX} characters or fewer`, "LOCATION_CTA_TEXT_TOO_LONG");
  }
  if (data.ctaLink !== undefined && !isSitePathOrUrl(data.ctaLink)) {
    fail("Button link must be a full URL or a path starting with /", "LOCATION_CTA_LINK_INVALID");
  }

  if (data.metaTitle !== undefined && data.metaTitle.length > L.META_TITLE_MAX) {
    fail(`SEO title must be ${L.META_TITLE_MAX} characters or fewer`, "LOCATION_META_TITLE_TOO_LONG");
  }
  if (data.metaDescription !== undefined && data.metaDescription.length > L.META_DESCRIPTION_MAX) {
    fail(`Meta description must be ${L.META_DESCRIPTION_MAX} characters or fewer`, "LOCATION_META_DESCRIPTION_TOO_LONG");
  }
  if (data.keywords !== undefined) {
    if (data.keywords.length > L.KEYWORDS_MAX_COUNT) fail(`At most ${L.KEYWORDS_MAX_COUNT} keywords`, "LOCATION_TOO_MANY_KEYWORDS");
    if (data.keywords.some((k) => k.length > L.KEYWORD_MAX_LENGTH)) {
      fail(`Each keyword must be ${L.KEYWORD_MAX_LENGTH} characters or fewer`, "LOCATION_KEYWORD_TOO_LONG");
    }
  }

  if (data.metaRobots !== undefined && !LOCATION_META_ROBOTS_OPTIONS.includes(data.metaRobots)) {
    fail("Invalid robots directive", "LOCATION_ROBOTS_INVALID", { metaRobots: data.metaRobots });
  }
  if (data.status !== undefined && !LOCATION_STATUSES.includes(data.status)) {
    fail("Invalid status", "LOCATION_STATUS_INVALID", { status: data.status });
  }
}

/**
 * Checks that only make sense on the whole record. A page may be saved
 * as a draft with gaps, but publishing requires enough area-specific
 * content that the page is not a thin, city-name-swapped duplicate.
 */
export function validateLocationComplete(data: Partial<LocationRecord>): void {
  const L = LOCATION_LIMITS;

  if (!data.slug) fail("Slug is required", "LOCATION_SLUG_REQUIRED");
  if (!data.areaName) fail("Area name is required", "LOCATION_AREA_REQUIRED");
  if (!data.title) fail("Page heading is required", "LOCATION_TITLE_REQUIRED");

  if (data.status !== "published") return;

  if ((data.intro ?? "").length < L.INTRO_MIN_TO_PUBLISH) {
    fail(
      `Write at least ${L.INTRO_MIN_TO_PUBLISH} characters of area-specific introduction before publishing`,
      "LOCATION_INTRO_TOO_SHORT"
    );
  }
  if ((data.localities ?? []).length < L.LOCALITIES_MIN_TO_PUBLISH) {
    fail(
      `Add at least ${L.LOCALITIES_MIN_TO_PUBLISH} localities or sectors served before publishing`,
      "LOCATION_TOO_FEW_LOCALITIES"
    );
  }
  if ((data.faqs ?? []).length < L.FAQS_MIN_TO_PUBLISH) {
    fail(`Add at least ${L.FAQS_MIN_TO_PUBLISH} area-specific FAQs before publishing`, "LOCATION_TOO_FEW_FAQS");
  }
  if (!data.metaTitle) fail("SEO title is required before publishing", "LOCATION_META_TITLE_REQUIRED");
  if (!data.metaDescription) fail("Meta description is required before publishing", "LOCATION_META_DESCRIPTION_REQUIRED");
}

/* =====================================================
   CREATE
===================================================== */
export async function createLocation(data: CreateLocationDTO, updatedBy: string): Promise<LocationRecord> {
  await db();

  const normalized = normalizeLocationInput(data);
  validateLocationFields(normalized);

  const record: Partial<LocationRecord> = {
    status: "draft",
    intro: "",
    heroImage: "",
    localities: [],
    serviceIds: [],
    projects: [],
    budgets: [],
    testimonials: [],
    faqs: [],
    ctaText: DEFAULT_LOCATION_CTA_TEXT,
    ctaLink: DEFAULT_LOCATION_CTA_LINK,
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    metaRobots: DEFAULT_LOCATION_META_ROBOTS,
    ...normalized,
    updatedBy,
  };
  validateLocationComplete(record);

  const existing = await locationRepository.findBySlug(record.slug!);
  if (existing) {
    throw new AppError({
      message: `A location page with the address /${record.slug} already exists`,
      code: "LOCATION_SLUG_DUPLICATE",
      statusCode: 409,
      context: { slug: record.slug },
    });
  }

  return locationRepository.create(record);
}

/* =====================================================
   READ
===================================================== */
export async function listLocations(filter: { status?: LocationStatus } = {}): Promise<LocationRecord[]> {
  await db();
  return locationRepository.findAll(filter);
}

export async function getLocationById(id: string): Promise<LocationRecord | null> {
  await db();
  if (!Types.ObjectId.isValid(id)) fail("Invalid location id", "LOCATION_INVALID_ID", { id });
  return locationRepository.findById(id);
}

export async function getLocationBySlug(slug: string): Promise<LocationRecord | null> {
  await db();
  return locationRepository.findBySlug(slugify(text(slug)));
}

/** Public reads: published pages only. */
export async function getPublishedLocationBySlug(slug: string): Promise<LocationRecord | null> {
  const record = await getLocationBySlug(slug);
  return record && record.status === "published" ? record : null;
}

/* =====================================================
   UPDATE
===================================================== */
export async function updateLocation(
  id: string,
  data: UpdateLocationDTO,
  updatedBy: string
): Promise<LocationRecord | null> {
  await db();

  if (!Types.ObjectId.isValid(id)) fail("Invalid location id", "LOCATION_INVALID_ID", { id });

  const existing = await locationRepository.findById(id);
  if (!existing) {
    throw new AppError({
      message: "Location page not found",
      code: "LOCATION_NOT_FOUND",
      statusCode: 404,
      context: { id },
    });
  }

  const normalized = normalizeLocationInput(data);
  validateLocationFields(normalized);

  const merged: Partial<LocationRecord> = { ...existing, ...normalized };
  validateLocationComplete(merged);

  if (normalized.slug && normalized.slug !== existing.slug) {
    const clash = await locationRepository.findBySlug(normalized.slug);
    if (clash && clash._id.toString() !== id) {
      throw new AppError({
        message: `A location page with the address /${normalized.slug} already exists`,
        code: "LOCATION_SLUG_DUPLICATE",
        statusCode: 409,
        context: { slug: normalized.slug, id },
      });
    }
  }

  return locationRepository.updateById(id, { ...normalized, updatedBy });
}

/* =====================================================
   DELETE
===================================================== */
export async function deleteLocation(id: string): Promise<boolean> {
  await db();
  if (!Types.ObjectId.isValid(id)) fail("Invalid location id", "LOCATION_INVALID_ID", { id });
  return locationRepository.deleteById(id);
}
