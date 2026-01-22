/***************************************************
 * File: modules/services/service.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Defines input and output contracts for Service module
 *
 * Responsibilities:
 * - Provide clean client-facing shapes
 *
 * Restrictions:
 * - Must NOT use ObjectId or Date
 ***************************************************/


/* -------------------------------------
    Shared Sub-Interfaces
------------------------------------- */
export interface ServiceVideoReelDTO {
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface ServiceVideoYoutubeDTO {
  embedId: string;
  title?: string;
  description?: string;
}

export interface ServiceVideoShowcaseDTO {
  reels: ServiceVideoReelDTO[];
  youtube: ServiceVideoYoutubeDTO[];
}


/* -------------------------------------
   Shared Sub-Interfaces
------------------------------------- */
export interface ServiceHighlightDTO {
  icon: string;
  title: string;
}

export interface ServiceCategorySummaryDTO {
  id: string;
  name: string;   // Schema ke according 'name'
  slug: string;   //
  icon?: string;  // Category ka icon dikhane ke liye
}

export interface ServiceGalleryDTO {
  url: string;
  alt?: string;
  caption?: string;
}

export interface ServiceFaqDTO {
  question: string;
  answer: string;
}

export interface ServiceSeoDTO {
  title?: string;
  description?: string;
  keywords: string[];
  ogImage?: string;
  metaRobots: string;
}

/* -------------------------------------
   Create Service DTO (Minimal for Start)
------------------------------------- */
export interface CreateServiceDTO {
  title: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  coverImage: string; // Initially ek image zaroori hai grid ke liye
}

/* -------------------------------------
   Update Service DTO (Full Update)
------------------------------------- */
export interface UpdateServiceDTO {
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: any; // Rich Text support
  categoryId?: string;
  
  coverImage?: string;
  gallery?: ServiceGalleryDTO[];
  videoShowcase?: Partial<ServiceVideoShowcaseDTO>; // Optional field
  highlights?: ServiceHighlightDTO[];
  faqs?: ServiceFaqDTO[];

  startingPrice?: number;
  priceUnit?: string;

  seo?: Partial<ServiceSeoDTO>;

  featured?: boolean;
  status?: "draft" | "published" | "archived";
  displayOrder?: number;

  ctaText?: string;
  ctaLink?: string;
}

/* -------------------------------------
   Service Response DTO (For UI)
------------------------------------- */
export interface ServiceResponseDTO {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: any;

  coverImage: string;
  gallery: ServiceGalleryDTO[];
  videoShowcase: ServiceVideoShowcaseDTO; // UI hamesha empty array expect karega undefined nahi
  highlights: ServiceHighlightDTO[];
  category: ServiceCategorySummaryDTO; 
  categoryId: string;
  faqs: ServiceFaqDTO[];

  startingPrice?: number;
  priceUnit: string;

  seo: ServiceSeoDTO;

  featured: boolean;
  status: "draft" | "published" | "archived";
  displayOrder: number;

  ctaText: string;
  ctaLink: string;

  createdAt: string;
  updatedAt: string;
}