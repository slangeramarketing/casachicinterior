/***************************************************
 * File: modules/locations/location.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Client-facing contracts for location pages (service <-> UI)
 *
 * Restrictions:
 * - Must NOT use ObjectId or Date
 ***************************************************/

import { LocationMetaRobots, LocationStatus } from "./location.types";

export interface LocationProjectDTO {
  title: string;
  locality?: string;
  flatSize?: string;
  scope?: string;
  description?: string;
  image?: string;
}

export interface LocationBudgetDTO {
  label: string;
  range: string;
}

export interface LocationTestimonialDTO {
  name: string;
  locality?: string;
  text: string;
  rating?: number;
}

export interface LocationFaqDTO {
  question: string;
  answer: string;
}

export interface LocationInputDTO {
  slug: string;
  areaName: string;
  title: string;
  intro?: string;
  heroImage?: string;
  localities?: string[];
  serviceIds?: string[];
  projects?: LocationProjectDTO[];
  budgets?: LocationBudgetDTO[];
  testimonials?: LocationTestimonialDTO[];
  faqs?: LocationFaqDTO[];
  ctaText?: string;
  ctaLink?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  metaRobots?: LocationMetaRobots;
  status?: LocationStatus;
}

export type CreateLocationDTO = LocationInputDTO;
export type UpdateLocationDTO = Partial<LocationInputDTO>;

export interface LocationResponseDTO {
  id: string;
  slug: string;
  areaName: string;
  title: string;
  intro: string;
  heroImage: string;
  localities: string[];
  serviceIds: string[];
  projects: Required<LocationProjectDTO>[];
  budgets: LocationBudgetDTO[];
  testimonials: Required<LocationTestimonialDTO>[];
  faqs: LocationFaqDTO[];
  ctaText: string;
  ctaLink: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  metaRobots: LocationMetaRobots;
  status: LocationStatus;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

/** Minimal shape for footer / sitemap links. */
export interface LocationLinkDTO {
  slug: string;
  areaName: string;
  title: string;
}
