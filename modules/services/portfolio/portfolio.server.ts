/***************************************************
 * File: modules/services/portfolio/portfolio.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - The ONLY layer that Server Components should import.
 * - Clean public API for data fetching without exposing internals.
 *
 * Restrictions:
 * - Server-only (no "use client" directive in consumers)
 * - Must NOT be imported by Client Components directly
 ***************************************************/

import { portfolioService } from "./portfolio.service";
import { PortfolioItemDTO } from "./portfolio.dto";

export async function getPortfolioProjects(): Promise<PortfolioItemDTO[]> {
  return portfolioService.getAllProjects();
}

export async function getFeaturedPortfolioProjects(): Promise<PortfolioItemDTO[]> {
  return portfolioService.getFeaturedProjects();
}

export async function getPortfolioProjectById(
  id: string
): Promise<PortfolioItemDTO | null> {
  return portfolioService.getProjectById(id);
}
