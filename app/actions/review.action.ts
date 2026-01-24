"use server";

/***************************************************
 * File: app/actions/review.actions.ts
 * Layer: Action (UI → Server bridge)
 *
 * Purpose:
 * - Trigger write operations for Review module from UI
 *
 * Responsibilities:
 * - Receive data from UI
 * - Perform basic input sanity checks
 * - Call Review Server Facade
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT access repository
 * - Must NOT format response
 ***************************************************/

import {
  CreateReviewLinkDTO,
  SubmitReviewDTO,
  UpdateReviewModerationDTO,
} from "@/modules/review/review.dto";

import { reviewServer } from "@/modules/review/review.server";

/* =================================================
   ADMIN → Generate Review Link
   ================================================= */

export async function createReviewLink(
  dto: CreateReviewLinkDTO
): Promise<{
  token: string;
  reviewLink: string;
  emailed: boolean;
}> {
  if (!dto.clientName || !dto.serviceId || !dto.submissionSource) {
    throw new Error("Missing required fields");
  }

  return reviewServer.generateReviewLink(dto);
}

/* =================================================
   CLIENT → Submit Review
   ================================================= */

export async function submitReview(
  dto: SubmitReviewDTO
) {
  if (!dto.token || !dto.rating || !dto.message) {
    throw new Error("Invalid review submission data");
  }

  return reviewServer.submitClientReview(dto);
}

/* =================================================
   ADMIN → Moderate Review
   ================================================= */

export async function moderateReviewAction(
  reviewId: string,
  dto: UpdateReviewModerationDTO
) {
  if (!reviewId) {
    throw new Error("Review ID is required");
  }

  return reviewServer.moderateReview(reviewId, dto);
}

/* =================================================
   ADMIN → Delete Review
   ================================================= */

export async function deleteReviewAction(
  reviewId: string
) {
  if (!reviewId) {
    throw new Error("Review ID is required");
  }

  return reviewServer.deleteReview(reviewId);
}
