/***************************************************
 * File: modules/locations/location.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Raw DB record shape for a location landing page
 *   (repository <-> service)
 *
 * Restrictions:
 * - Must NOT contain DTOs or formatting logic
 ***************************************************/

import { Types } from "mongoose";
import { LOCATION_META_ROBOTS_OPTIONS, LOCATION_STATUSES } from "./location.constants";

export type LocationStatus = (typeof LOCATION_STATUSES)[number];
export type LocationMetaRobots = (typeof LOCATION_META_ROBOTS_OPTIONS)[number];

export interface LocationProjectRecord {
  title: string;
  locality: string;
  flatSize: string;
  scope: string;
  description: string;
  image: string;
}

export interface LocationBudgetRecord {
  label: string;
  range: string;
}

export interface LocationTestimonialRecord {
  name: string;
  locality: string;
  text: string;
  rating: number;
}

export interface LocationFaqRecord {
  question: string;
  answer: string;
}

export interface LocationRecord {
  _id: Types.ObjectId;

  /** URL segment at the site root, e.g. "interior-designers-in-noida". Unique. */
  slug: string;
  /** Short area name used in headings, breadcrumbs and schema, e.g. "Noida". */
  areaName: string;
  /** Page H1, e.g. "Interior Designers in Noida". */
  title: string;
  /** Area-specific introduction (plain text, paragraphs separated by blank lines). */
  intro: string;
  heroImage: string;

  localities: string[];
  /** Service ids (modules/services) offered in this area; rendered as links. */
  serviceIds: string[];
  projects: LocationProjectRecord[];
  budgets: LocationBudgetRecord[];
  testimonials: LocationTestimonialRecord[];
  faqs: LocationFaqRecord[];

  ctaText: string;
  ctaLink: string;

  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  metaRobots: LocationMetaRobots;

  status: LocationStatus;
  updatedBy: string;

  createdAt: Date;
  updatedAt: Date;
}
