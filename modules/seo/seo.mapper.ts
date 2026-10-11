/***************************************************
 * File: modules/seo/seo.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Convert PageSeo DB records to response DTOs
 *
 * Restrictions:
 * - No business logic, no database access
 ***************************************************/

import { PageSeoRecord } from "./seo.types";
import { PageSeoResponseDTO } from "./seo.dto";
import { getManagedPage } from "@/lib/seo/managedPages";
import { DEFAULT_META_ROBOTS } from "./seo.constants";

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return "";
}

export const seoMapper = {
  toResponse(record: PageSeoRecord): PageSeoResponseDTO {
    if (!record || !record._id) {
      throw new Error("Invalid PageSeo record: missing _id");
    }

    return {
      id: record._id.toString(),
      route: record.route,
      routeLabel: getManagedPage(record.route)?.label ?? record.route,
      title: record.title ?? "",
      description: record.description ?? "",
      primaryKeyword: record.primaryKeyword ?? "",
      secondaryKeywords: Array.isArray(record.secondaryKeywords)
        ? record.secondaryKeywords
        : [],
      heading: record.heading ?? "",
      canonicalUrl: record.canonicalUrl ?? "",
      ogImage: record.ogImage ?? "",
      metaRobots: record.metaRobots ?? DEFAULT_META_ROBOTS,
      status: record.status ?? "draft",
      updatedBy: record.updatedBy ?? "",
      createdAt: toIso(record.createdAt),
      updatedAt: toIso(record.updatedAt),
    };
  },

  toResponseList(records: PageSeoRecord[]): PageSeoResponseDTO[] {
    if (!Array.isArray(records)) return [];
    return records.map((r) => this.toResponse(r));
  },
};
