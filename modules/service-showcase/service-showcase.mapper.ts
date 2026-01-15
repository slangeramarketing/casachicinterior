/***************************************************
 * File: service-showcase.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Convert DB records → DTO responses
 *
 * Rules:
 * - No business logic
 * - No DB access
 ***************************************************/

import { ServiceShowcaseRecord } from "./service-showcase.types";
import { ServiceShowcaseResponseDTO } from "./service-showcase.dto";

export const serviceShowcaseMapper = {
  toResponse(
    record: ServiceShowcaseRecord
  ): ServiceShowcaseResponseDTO {
    return {
      id: record.id,
      serviceId: record.serviceId,

      title: record.title,

      beforeImage: record.beforeImage,
      afterImage: record.afterImage,

      problem: record.problem,
      solution: record.solution,
      result: record.result,

      displayOrder: record.displayOrder,
      isActive: record.isActive,

      createdAt: record.createdAt.toISOString(),
    };
  },

  toResponseList(
    records: ServiceShowcaseRecord[]
  ): ServiceShowcaseResponseDTO[] {
    return records.map(this.toResponse);
  },
};
