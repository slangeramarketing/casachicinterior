/***************************************************
 * File: modules/design-process/design-process.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Define input & output shapes
 *
 * Responsibilities:
 * - Validate boundary contracts
 *
 * Restrictions:
 * - No business logic
 ***************************************************/

/* =========================
   CREATE
========================= */
export interface CreateDesignProcessDTO {
  serviceId: string;

  title: string;
  description: string;

  icon?: string;

  stepOrder: number;
}

/* =========================
   UPDATE
========================= */
export interface UpdateDesignProcessDTO {
  title?: string;
  description?: string;

  icon?: string;

  stepOrder?: number;
  isActive?: boolean;
}

/* =========================
   RESPONSE
========================= */
export interface DesignProcessResponseDTO {
  id: string;

  serviceId: string;

  title: string;
  description: string;

  icon?: string;

  stepOrder: number;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
