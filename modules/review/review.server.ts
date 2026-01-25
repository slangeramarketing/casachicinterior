/***************************************************
 * File: modules/reviews/review.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Acts as Next.js server-side adapter for Review module
 *
 * Responsibilities:
 * - Perform auth / role checks for admin operations
 * - Call service layer only
 * - Map domain records to response DTOs
 *
 * Restrictions:
 * - Must NOT access repository directly
 * - Must NOT contain business logic
 * - Must NOT generate tokens
 *
 * Notes:
 * - This file exports a stateless object with methods
 ***************************************************/

import {
  generateReviewLink as generateReviewLinkService,
  validateReviewToken as validateReviewTokenService,
  submitClientReview as submitClientReviewService,
  getAdminReviews as getAdminReviewsService,
  moderateReview as moderateReviewService,
  deleteReview as deleteReviewService,
  findReviewById,
} from "./review.service";

import { reviewMapper } from "./review.mapper";
import {
  CreateReviewLinkDTO,
  SubmitReviewDTO,
  UpdateReviewModerationDTO,
} from "./review.dto";

/* =================================================
   Server Facade Object
================================================= */

export const reviewServer = {
  /* ===============================================
     ADMIN → Generate Review Link
     =============================================== */

  async generateReviewLink(dto: CreateReviewLinkDTO) {
    const result = await generateReviewLinkService(dto);

    return {
      token: result.token,
      reviewLink: result.reviewLink,
      emailed: result.emailed,
    };
  },

  /* ===============================================
     PUBLIC → Validate Review Token
     =============================================== */

  async validateReviewToken(token: string) {
    const record = await validateReviewTokenService(token);
    return reviewMapper.toResponse(record);
  },

  /* ===============================================
     PUBLIC → Submit Review
     =============================================== */

  async submitClientReview(dto: SubmitReviewDTO) {
    const record = await submitClientReviewService(dto);
    return reviewMapper.toResponse(record);
  },

  /* ===============================================
     ADMIN → List Reviews
     =============================================== */

  async getAdminReviews(filters?: {
    status?: "pending" | "approved" | "rejected";
    isFeatured?: boolean;
    serviceId?: string;
  }) {
    const records = await getAdminReviewsService(filters);
    return reviewMapper.toResponseList(records);
  },

  /* ===============================================
   PUBLIC → Featured Approved Reviews
   =============================================== */

  async getPublicFeaturedReviews() {
    const records = await getAdminReviewsService({
      status: "approved",
      isFeatured: true,
    });

    return reviewMapper.toResponseList(records);
  },

    /* ===============================================
     ADMIN → Find Review By ID
     =============================================== */
  async findById(reviewId: string) {
    console.log("ServerLayer reviewID: ",reviewId);
    const record = await findReviewById(reviewId);
    if (!record) return null;
    return reviewMapper.toResponse(record);
  },

  /* ===============================================
     ADMIN → Moderate Review
     =============================================== */

  async moderateReview(
    reviewId: string,
    dto: UpdateReviewModerationDTO
  ) {
    const record = await moderateReviewService(reviewId, dto);
    return reviewMapper.toResponse(record);
  },

  /* ===============================================
     ADMIN → Soft Delete Review
     =============================================== */

  async deleteReview(reviewId: string) {
    await deleteReviewService(reviewId);
    return { success: true };
  },
};
