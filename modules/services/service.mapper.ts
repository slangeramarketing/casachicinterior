import { ServiceResponseDTO } from "./service.dto";

export const serviceMapper = {
  toResponse(record: any): ServiceResponseDTO {
    const isPopulated =
      record.categoryId &&
      typeof record.categoryId === "object" &&
      "name" in record.categoryId;

    const category = isPopulated
      ? {
          id: record.categoryId._id.toString(),
          name: record.categoryId.name,
          slug: record.categoryId.slug,
          icon: record.categoryId.icon || "check",
        }
      : {
          // 🔒 fallback when not populated
          id: record.categoryId.toString(),
          name: "Unknown",
          slug: "unknown",
          icon: "check",
        };

    return {
      id: record._id.toString(),
      slug: record.slug,
      title: record.title,
      shortDescription: record.shortDescription,
      description: record.description,

      categoryId: category.id,
      category, // ✅ NEVER undefined

      coverImage: record.coverImage,

      gallery: (record.gallery || []).map((img: any) => ({
        url: img.url,
        alt: img.alt || "",
        caption: img.caption || "",
      })),

      videoShowcase: {
        enabled: record.videoShowcase?.enabled ?? true,

        reels: (record.videoShowcase?.reels || []).map((r: any) => ({
          url: r.url,
          thumbnail: r.thumbnail ?? null,
          title: r.title || "",
          featured: !!r.featured,
          order: r.order ?? 0,
        })),

        youtube: (record.videoShowcase?.youtube || []).map((y: any) => ({
          embedId: y.embedId,
          title: y.title || "",
          description: y.description || "",
          featured: !!y.featured,
          order: y.order ?? 0,
        })),
      },

      highlights: (record.highlights || []).map((h: any) => ({
        icon: h.icon,
        title: h.title,
      })),

      faqs: (record.faqs || []).map((f: any) => ({
        question: f.question,
        answer: f.answer,
      })),

      startingPrice: record.startingPrice,
      priceUnit: record.priceUnit,

      seo: {
        title: record.seo?.title || "",
        description: record.seo?.description || "",
        keywords: record.seo?.keywords || [],
        ogImage: record.seo?.ogImage || "",
        metaRobots: record.seo?.metaRobots || "index, follow",
      },

      featured: !!record.featured,
      status: record.status,
      displayOrder: record.displayOrder,

      ctaText: record.ctaText || "",
      ctaLink: record.ctaLink || "",

      createdAt:
        record.createdAt instanceof Date
          ? record.createdAt.toISOString()
          : record.createdAt,

      updatedAt:
        record.updatedAt instanceof Date
          ? record.updatedAt.toISOString()
          : record.updatedAt,
    };
  },

  toResponseList(records: any[]): ServiceResponseDTO[] {
    return records.map((rec) => this.toResponse(rec));
  },
};
