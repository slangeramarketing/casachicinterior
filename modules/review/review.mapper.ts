/***************************************************
 * File: modules/reviews/review.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Converts Review DB records into Response DTOs
 *
 * Responsibilities:
 * - Transform ObjectId → string
 * - Transform Date → ISO string
 *
 * Restrictions:
 * - Must NOT access database
 * - Must NOT contain business logic
 * - Must NOT perform validation
 ***************************************************/

import { ReviewRecord } from "./review.types";
import { ReviewResponseDTO } from "./review.dto";

export const reviewMapper = {
  /**
   * Purpose:
   * - Convert a single ReviewRecord into ReviewResponseDTO
   *
   * Used By:
   * - Server Facade
   * - Controller
   *
   * Returns:
   * - Client-safe ReviewResponseDTO
   */
  toResponse(record: ReviewRecord): ReviewResponseDTO {
    return {
      id: record._id.toString(),

      clientName: record.clientName,
      clientEmail: record.clientEmail,
      clientAvatar: record.clientAvatar,
      clientLocation: record.clientLocation,

      rating: record.rating,
      message: record.message,

      submissionSource: record.submissionSource,

      status: record.status,
      isFeatured: record.isFeatured,

      serviceId: record.serviceId.toString(),
      projectId: record.projectId
        ? record.projectId.toString()
        : undefined,

      submittedAt: record.submittedAt
        ? record.submittedAt.toISOString()
        : undefined,
      adminResponse:record.adminResponse,

      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  },

  /**
   * Purpose:
   * - Convert multiple ReviewRecords into DTO list
   *
   * Used By:
   * - Admin dashboards
   * - Listing APIs
   */
  toResponseList(records: ReviewRecord[]): ReviewResponseDTO[] {
    return records.map(this.toResponse);
  },
};
