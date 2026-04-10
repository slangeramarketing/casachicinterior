/***************************************************
 * File: modules/services/portfolio/portfolio.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Reads portfolio data from the local JSON data store.
 * - This is the ONLY layer that touches raw data.
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT expose raw records to the UI
 ***************************************************/

import { PortfolioRecord } from "./portfolio.types";
import portfolioData from "./portfolio.data.json";

class PortfolioRepository {
  private records: PortfolioRecord[];

  constructor() {
    // Cast JSON to typed PortfolioRecord[]
    this.records = portfolioData as PortfolioRecord[];
  }

  async findAll(): Promise<PortfolioRecord[]> {
    return [...this.records].sort((a, b) => a.order - b.order);
  }

  async findFeatured(): Promise<PortfolioRecord[]> {
    return this.records
      .filter((r) => r.featured)
      .sort((a, b) => a.order - b.order);
  }

  async findById(id: string): Promise<PortfolioRecord | null> {
    return this.records.find((r) => r.id === id) ?? null;
  }

  async findByRenovationType(type: string): Promise<PortfolioRecord[]> {
    return this.records
      .filter((r) => r.renovationType === type)
      .sort((a, b) => a.order - b.order);
  }
}

// Singleton instance
export const portfolioRepository = new PortfolioRepository();
