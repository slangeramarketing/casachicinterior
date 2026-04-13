/***************************************************
 * File: modules/services/portfolio/portfolio.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Transforms PortfolioRecord (raw JSON) → PortfolioItemDTO (UI-safe)
 *
 * Restrictions:
 * - No async logic, no DB calls
 ***************************************************/

import { PortfolioRecord } from "./portfolio.types";
import { PortfolioItemDTO } from "../../portfolio/portfolio.dto";

function formatCostRange(record: PortfolioRecord): string {
  const { min, max, unit } = record.costEstimate;
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  return `${fmt(min)} – ${fmt(max)} ${unit}`;
}

function formatTimeline(record: PortfolioRecord): string {
  const { duration, unit } = record.timeline;
  const label = unit.charAt(0).toUpperCase() + unit.slice(1);
  return `${duration} ${label}`;
}

export function mapPortfolioRecordToDTO(record: PortfolioRecord): PortfolioItemDTO {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    renovationType: record.renovationType,
    location: record.location,
    beforeImg: record.beforeImg,
    afterImg: record.afterImg,
    gallery: record.gallery || [],
    videoUrl: record.videoUrl,
    costRange: formatCostRange(record),
    costBreakdown: record.costBreakdown?.map((c) => ({
      category: c.category,
      amountLabel: c.amountLabel,
    })),
    milestones: record.milestones?.map((m) => ({
      title: m.title,
      day: m.day,
    })),
    timelineLabel: formatTimeline(record),
    materialSpecList: record.materialSpecList.map((m) => ({
      brand: m.brand,
      category: m.category,
      productLine: m.productLine,
    })),
    highlights: record.highlights,
    testimonial: record.testimonial,
    designReference: record.designReference,
    featured: record.featured,
  };
}
