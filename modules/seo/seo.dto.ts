/***************************************************
 * File: modules/seo/seo.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Client-facing contracts for page SEO entries (service <-> UI)
 *
 * Restrictions:
 * - Must NOT use ObjectId or Date
 ***************************************************/

import { MetaRobots, PageSeoStatus } from "./seo.types";

export interface PageSeoInputDTO {
  route: string;
  title: string;
  description: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  heading?: string;
  canonicalUrl?: string;
  ogImage?: string;
  metaRobots?: MetaRobots;
  status?: PageSeoStatus;
}

export type CreatePageSeoDTO = PageSeoInputDTO;
export type UpdatePageSeoDTO = Partial<PageSeoInputDTO>;

export interface PageSeoResponseDTO {
  id: string;
  route: string;
  /** Human label from the managed page registry, e.g. "About Us". */
  routeLabel: string;
  title: string;
  description: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  heading: string;
  canonicalUrl: string;
  ogImage: string;
  metaRobots: MetaRobots;
  status: PageSeoStatus;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
