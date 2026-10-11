/***************************************************
 * File: modules/seo/seo.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Raw DB record shape for a page SEO entry (repository <-> service)
 *
 * Restrictions:
 * - Must NOT contain DTOs or formatting logic
 ***************************************************/

import { Types } from "mongoose";
import { META_ROBOTS_OPTIONS, PAGE_SEO_STATUSES } from "./seo.constants";

export type PageSeoStatus = (typeof PAGE_SEO_STATUSES)[number];
export type MetaRobots = (typeof META_ROBOTS_OPTIONS)[number];

export interface PageSeoRecord {
  _id: Types.ObjectId;

  /** Public route this record applies to, e.g. "/about". Unique. */
  route: string;

  title: string;
  description: string;

  primaryKeyword: string;
  secondaryKeywords: string[];

  /** Optional override for the page's primary (H1) heading. */
  heading: string;

  /** Optional absolute canonical override. Empty = derived from route. */
  canonicalUrl: string;

  /** Optional Open Graph image (absolute URL or site-relative path). */
  ogImage: string;

  metaRobots: MetaRobots;
  status: PageSeoStatus;

  /** Email or id of the admin who last saved the record. */
  updatedBy: string;

  createdAt: Date;
  updatedAt: Date;
}
