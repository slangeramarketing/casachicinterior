/***************************************************
 * File: modules/locations/location.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Convert Location DB records to response DTOs
 *
 * Restrictions:
 * - No business logic, no database access
 ***************************************************/

import { LocationRecord } from "./location.types";
import { LocationLinkDTO, LocationResponseDTO } from "./location.dto";
import {
  DEFAULT_LOCATION_CTA_LINK,
  DEFAULT_LOCATION_CTA_TEXT,
  DEFAULT_LOCATION_META_ROBOTS,
} from "./location.constants";

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return "";
}

function list<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export const locationMapper = {
  toResponse(record: LocationRecord): LocationResponseDTO {
    if (!record || !record._id) {
      throw new Error("Invalid Location record: missing _id");
    }

    return {
      id: record._id.toString(),
      slug: record.slug,
      areaName: record.areaName ?? "",
      title: record.title ?? "",
      intro: record.intro ?? "",
      heroImage: record.heroImage ?? "",
      localities: list<string>(record.localities),
      serviceIds: list<string>(record.serviceIds),
      projects: list<LocationRecord["projects"][number]>(record.projects).map((p) => ({
        title: p.title ?? "",
        locality: p.locality ?? "",
        flatSize: p.flatSize ?? "",
        scope: p.scope ?? "",
        description: p.description ?? "",
        image: p.image ?? "",
      })),
      budgets: list<LocationRecord["budgets"][number]>(record.budgets).map((b) => ({
        label: b.label ?? "",
        range: b.range ?? "",
      })),
      testimonials: list<LocationRecord["testimonials"][number]>(record.testimonials).map((t) => ({
        name: t.name ?? "",
        locality: t.locality ?? "",
        text: t.text ?? "",
        rating: typeof t.rating === "number" ? t.rating : 5,
      })),
      faqs: list<LocationRecord["faqs"][number]>(record.faqs).map((f) => ({
        question: f.question ?? "",
        answer: f.answer ?? "",
      })),
      ctaText: record.ctaText || DEFAULT_LOCATION_CTA_TEXT,
      ctaLink: record.ctaLink || DEFAULT_LOCATION_CTA_LINK,
      metaTitle: record.metaTitle ?? "",
      metaDescription: record.metaDescription ?? "",
      keywords: list<string>(record.keywords),
      metaRobots: record.metaRobots ?? DEFAULT_LOCATION_META_ROBOTS,
      status: record.status ?? "draft",
      updatedBy: record.updatedBy ?? "",
      createdAt: toIso(record.createdAt),
      updatedAt: toIso(record.updatedAt),
    };
  },

  toResponseList(records: LocationRecord[]): LocationResponseDTO[] {
    if (!Array.isArray(records)) return [];
    return records.map((r) => this.toResponse(r));
  },

  toLink(record: LocationRecord): LocationLinkDTO {
    return { slug: record.slug, areaName: record.areaName ?? "", title: record.title ?? "" };
  },

  toLinkList(records: LocationRecord[]): LocationLinkDTO[] {
    if (!Array.isArray(records)) return [];
    return records.map((r) => this.toLink(r));
  },
};
