import { ServiceResponseDTO } from "./service.dto";
import { AppError } from "@/lib/errors";

export const serviceMapper = {
  toResponse(record: any): ServiceResponseDTO {
    if (!record) {
      throw new AppError({
        message: "ServiceMapper received null/undefined record",
        code: "MAPPER_NULL_RECORD",
        statusCode: 500,
      });
    }

    if (!record._id) {
      throw new AppError({
        message: "Service record missing _id",
        code: "MAPPER_MISSING_ID",
        statusCode: 500,
        context: { record },
      });
    }

    /* --------------------------------
       CATEGORY (DEFENSIVE)
    --------------------------------- */
    let categoryId: string;
    let category: ServiceResponseDTO["category"];

    if (
      record.categoryId &&
      typeof record.categoryId === "object" &&
      record.categoryId._id
    ) {
      categoryId = record.categoryId._id.toString();
      category = {
        id: categoryId,
        name: record.categoryId.name ?? "Unknown",
        slug: record.categoryId.slug ?? "unknown",
        icon: record.categoryId.icon ?? "check",
      };
    } else if (record.categoryId) {
      categoryId = record.categoryId.toString();
      category = {
        id: categoryId,
        name: "Unknown",
        slug: "unknown",
        icon: "check",
      };
    } else {
      // 🔥 THIS WAS YOUR PRODUCTION CRASH ROOT CAUSE
      throw new AppError({
        message: "Service record has null categoryId",
        code: "MAPPER_NULL_CATEGORY",
        statusCode: 500,
        context: { serviceId: record._id.toString() },
      });
    }

    /* --------------------------------
       VIDEO SHOWCASE (SAFE DEFAULTS)
    --------------------------------- */
    const videoShowcase = record.videoShowcase ?? {
      enabled: true,
      reels: [],
      youtube: [],
    };

    return {
      id: record._id.toString(),
      slug: record.slug ?? "",
      title: record.title ?? "",
      shortDescription: record.shortDescription ?? "",
      description: record.description ?? "",

      categoryId,
      category,

      coverImage: record.coverImage ?? "",

      gallery: Array.isArray(record.gallery)
        ? record.gallery.map((img: any) => ({
            url: img?.url ?? "",
            alt: img?.alt ?? "",
            caption: img?.caption ?? "",
          }))
        : [],

      videoShowcase: {
        enabled: videoShowcase.enabled ?? true,

        reels: Array.isArray(videoShowcase.reels)
          ? videoShowcase.reels.map((r: any) => ({
              url: r?.url ?? "",
              thumbnail: r?.thumbnail ?? null,
              title: r?.title ?? "",
              featured: !!r?.featured,
              order: typeof r?.order === "number" ? r.order : 0,
            }))
          : [],

        youtube: Array.isArray(videoShowcase.youtube)
          ? videoShowcase.youtube.map((y: any) => ({
              embedId: y?.embedId ?? "",
              title: y?.title ?? "",
              description: y?.description ?? "",
              featured: !!y?.featured,
              order: typeof y?.order === "number" ? y.order : 0,
            }))
          : [],
      },

      highlights: Array.isArray(record.highlights)
        ? record.highlights.map((h: any) => ({
            icon: h?.icon ?? "check",
            title: h?.title ?? "",
          }))
        : [],

      faqs: Array.isArray(record.faqs)
        ? record.faqs.map((f: any) => ({
            question: f?.question ?? "",
            answer: f?.answer ?? "",
          }))
        : [],

      startingPrice: record.startingPrice ?? undefined,
      priceUnit: record.priceUnit ?? "",

      seo: {
        title: record.seo?.title ?? "",
        description: record.seo?.description ?? "",
        keywords: record.seo?.keywords ?? [],
        ogImage: record.seo?.ogImage ?? "",
        metaRobots: record.seo?.metaRobots ?? "index, follow",
      },

      featured: !!record.featured,
      status: record.status ?? "draft",
      displayOrder: typeof record.displayOrder === "number" ? record.displayOrder : 0,

      ctaText: record.ctaText ?? "",
      ctaLink: record.ctaLink ?? "",

      createdAt:
        record.createdAt instanceof Date
          ? record.createdAt.toISOString()
          : String(record.createdAt ?? ""),

      updatedAt:
        record.updatedAt instanceof Date
          ? record.updatedAt.toISOString()
          : String(record.updatedAt ?? ""),
    };
  },

  toResponseList(records: any[]): ServiceResponseDTO[] {
    if (!Array.isArray(records)) {
      throw new AppError({
        message: "ServiceMapper expected array",
        code: "MAPPER_INVALID_LIST",
        statusCode: 500,
        context: { records },
      });
    }

    return records.map((rec) => this.toResponse(rec));
  },
};
