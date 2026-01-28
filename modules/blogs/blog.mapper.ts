/***************************************************
 * File: modules/blogs/blog.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Converts raw/populated DB records into clean BlogResponseDTOs.
 * - Handles Date-to-String serialization and ID stringification.
 *
 * Responsibilities:
 * - Mapping raw DB fields to UI-friendly structures.
 * - Providing fallbacks for optional or missing fields.
 *
 * Restrictions:
 * - Must NOT contain business logic.
 * - Must NOT perform database operations.
 ***************************************************/
/***************************************************
 * File: modules/blogs/blog.mapper.ts
 * Layer: Mapper
 ***************************************************/

import { BlogResponseDTO } from "./blog.dto";

type AnyDoc = Record<string, any>;

export const BlogMapper = {
  toResponse(doc: AnyDoc): BlogResponseDTO {
    if (!doc) {
      throw new Error("BlogMapper.toResponse received null/undefined document");
    }

    /* ----------------------------------
       SAFE HELPERS
    ---------------------------------- */
    const toIdString = (val: any): string => {
      if (!val) return "";
      if (typeof val === "string") return val;
      if (val._id) return val._id.toString();
      return val.toString?.() ?? "";
    };

    const toISO = (val: any): string | undefined => {
      if (!val) return undefined;
      if (val instanceof Date) return val.toISOString();
      return undefined;
    };

    /* ----------------------------------
       CATEGORY (populated OR raw)
    ---------------------------------- */
    const categoryId = doc.categoryId ?? null;

    const category = {
      id: toIdString(categoryId),
      name:
        typeof categoryId === "object" && categoryId?.name
          ? categoryId.name
          : "Uncategorized",
      slug:
        typeof categoryId === "object" && categoryId?.slug
          ? categoryId.slug
          : "",
    };

    /* ----------------------------------
       AUTHOR (populated OR raw)
    ---------------------------------- */
    const authorId = doc.authorId ?? null;

    const author = {
      id: toIdString(authorId),
      name:
        typeof authorId === "object" && authorId?.name
          ? authorId.name
          : "Admin",
      image:
        typeof authorId === "object" && authorId?.image
          ? authorId.image
          : "",
    };

    /* ----------------------------------
       RESPONSE DTO
    ---------------------------------- */
    return {
      id: toIdString(doc._id),

      title: doc.title ?? "",
      slug: doc.slug ?? "",
      summary: doc.summary ?? "",
      content: doc.content ?? "",

      thumbnail: doc.thumbnail ?? "",
      bannerImage: doc.bannerImage ?? "",

      category,
      author,

      tags: Array.isArray(doc.tags) ? doc.tags : [],
      readingTime: typeof doc.readingTime === "number" ? doc.readingTime : 0,
      viewCount: typeof doc.viewCount === "number" ? doc.viewCount : 0,

      seo: {
        metaTitle: doc.seo?.metaTitle ?? doc.title ?? "",
        metaDescription: doc.seo?.metaDescription ?? doc.summary ?? "",
        keywords: Array.isArray(doc.seo?.keywords)
          ? doc.seo.keywords
          : [],
        ogImage: doc.seo?.ogImage ?? doc.thumbnail ?? "",
        canonicalUrl: doc.seo?.canonicalUrl ?? "",
        metaRobots: doc.seo?.metaRobots ?? "index, follow",
      },

      status: doc.status ?? "draft",
      featured: Boolean(doc.featured),

      publishedAt: toISO(doc.publishedAt),
      createdAt: toISO(doc.createdAt) ?? new Date().toISOString(),
      updatedAt: toISO(doc.updatedAt) ?? new Date().toISOString(),
    };
  },

  toResponseList(docs: AnyDoc[]): BlogResponseDTO[] {
    if (!Array.isArray(docs)) return [];
    return docs.map((doc) => this.toResponse(doc));
  },
};
