/***************************************************
 * File: service-showcase.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Define input/output contracts
 *
 * Notes:
 * - Used by server layer only
 ***************************************************/

/* =============================
   CREATE
============================= */
export interface CreateServiceShowcaseDTO {
  serviceId: string;

  title: string;

  beforeImage: string;
  afterImage: string;

  problem: string;
  solution: string;
  result: string;

  displayOrder?: number;
  isActive?: boolean;
}

/* =============================
   UPDATE
============================= */
export interface UpdateServiceShowcaseDTO {
  title?: string;

  beforeImage?: string;
  afterImage?: string;

  problem?: string;
  solution?: string;
  result?: string;

  displayOrder?: number;
  isActive?: boolean;
}

/* =============================
   RESPONSE (PUBLIC / ADMIN)
============================= */
export interface ServiceShowcaseResponseDTO {
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

  createdAt: string;
}
