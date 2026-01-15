/***************************************************
 * File: modules/design-process/design-process.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Convert DB records → API response DTOs
 *
 * Responsibilities:
 * - ID normalization
 * - Date serialization
 *
 * Restrictions:
 * - No business logic
 ***************************************************/

import { DesignProcessRecord } from "./design-process.types";
import { DesignProcessResponseDTO } from "./design-process.dto";

export const designProcessMapper = {
  /* =========================
     Single
  ========================= */
  toResponse(
    record: DesignProcessRecord
  ): DesignProcessResponseDTO {
    return {
      id: record._id.toString(),

      serviceId: record.serviceId.toString(),

      title: record.title,
      description: record.description,

      icon: record.icon,

      stepOrder: record.stepOrder,
      isActive: record.isActive,

      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  },

  /* =========================
     List
  ========================= */
  toResponseList(
    records: DesignProcessRecord[]
  ): DesignProcessResponseDTO[] {
    return records.map(this.toResponse);
  },
};
