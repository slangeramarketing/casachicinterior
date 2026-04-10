/***************************************************
 * File: modules/services/portfolio/portfolio.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Business logic for portfolio data access.
 * - Maps raw records to DTOs via the Mapper.
 *
 * Restrictions:
 * - Must NOT interact with UI
 * - Must NOT access DB directly — always via Repository
 ***************************************************/

import { portfolioRepository } from "./portfolio.repository";
import { mapPortfolioRecordToDTO } from "./portfolio.mapper";
import { PortfolioItemDTO } from "./portfolio.dto";

class PortfolioService {
  async getAllProjects(): Promise<PortfolioItemDTO[]> {
    const records = await portfolioRepository.findAll();
    return records.map(mapPortfolioRecordToDTO);
  }

  async getFeaturedProjects(): Promise<PortfolioItemDTO[]> {
    const records = await portfolioRepository.findFeatured();
    return records.map(mapPortfolioRecordToDTO);
  }

  async getProjectById(id: string): Promise<PortfolioItemDTO | null> {
    const record = await portfolioRepository.findById(id);
    return record ? mapPortfolioRecordToDTO(record) : null;
  }

  async getProjectsByType(type: string): Promise<PortfolioItemDTO[]> {
    const records = await portfolioRepository.findByRenovationType(type);
    return records.map(mapPortfolioRecordToDTO);
  }
}

export const portfolioService = new PortfolioService();
