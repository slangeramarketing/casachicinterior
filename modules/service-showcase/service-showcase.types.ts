/***************************************************
 * File: service-showcase.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Define internal TypeScript types for ServiceShowcase
 *
 * Notes:
 * - Used by repository & service layers
 * - Mirrors DB structure (not DTO)
 ***************************************************/

export interface ServiceShowcaseRecord {
  id: string;

  serviceId: string;

  title: string;

  beforeImage: string;
  afterImage: string;

  problem: string;
  solution: string;
  result: string;

  displayOrder: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
