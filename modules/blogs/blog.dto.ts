/***************************************************
 * File: modules/blogs/blog.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Defines external contracts for the Blog module.
 *
 * Responsibilities:
 * - Provides input shapes for creating and updating blogs.
 * - Defines the standard response structure for the UI.
 *
 * Restrictions:
 * - Must NOT use Mongoose ObjectId (use string).
 * - Must NOT use Date objects (use ISO string).
 ***************************************************/

/**
 * SEO metadata structure for blog posts
 */
export interface BlogSeoDTO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
  metaRobots: string;
}

/**
 * Data required to create a new blog post
 */
export interface CreateBlogDTO {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  thumbnail?: string;
  bannerImage?: string;
  categoryId: string; // UI sends this as a string ID
  authorId: string;   // UI sends this as a string ID
  tags?: string[];
  status?: "draft" | "published";
  featured?: boolean;
  seo?: Partial<BlogSeoDTO>;
}

/**
 * Data allowed for updating an existing blog post
 */
export interface UpdateBlogDTO extends Partial<CreateBlogDTO> {
  // All fields are optional during update
}

/**
 * Standard response structure for Blog data.
 * This is what the UI receives after mapping.
 */
export interface BlogResponseDTO {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  bannerImage: string;
  
  // Populated Category Object
  category: {
    id: string;
    name: string;
    slug: string;
  };

  // Populated Author Object
  author: {
    id: string;
    name: string;
    image: string;
  };

  tags: string[];
  readingTime: number;
  viewCount: number;
  seo: BlogSeoDTO;
  status: "draft" | "published";
  featured: boolean;
  
  // Serialized Dates as Strings
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}