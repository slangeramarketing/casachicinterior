/***************************************************
 * File: modules/reviews/review.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Contains all business logic for Review module
 *
 * Responsibilities:
 * - Generate secure review links
 * - Validate review tokens
 * - Handle client review submission
 * - Handle admin moderation & deletion
 *
 * Restrictions:
 * - Must NOT format response
 * - Must NOT return DTOs
 * - Must NOT access HTTP / cookies
 ***************************************************/

import crypto from "crypto";
import { Types } from "mongoose";
import { reviewRepository } from "./review.repository";
import {
  CreateReviewLinkDTO,
  SubmitReviewDTO,
  UpdateReviewModerationDTO,
} from "./review.dto";
import { ReviewRecord } from "./review.types";
import { renderReviewInviteEmail } from "@/lib/email/templates/review-invite";
import { sendMail } from "@/lib/email/mailer";
import { getGravatarUrl } from "@/lib/utils/gravatar";
import db from "@/lib/db";

/* =================================================
   ADMIN → Generate Review Link
   ================================================= */

export async function generateReviewLink(
  dto: CreateReviewLinkDTO
): Promise<{ token: string; reviewLink: string; emailed: boolean }> {
  await db();

  if (dto.submissionSource === "email" && !dto.clientEmail) {
    throw new Error("Client email is required for email-based review link.");
  }

  const token = crypto.randomBytes(24).toString("hex");

  await reviewRepository.createTokenRecord({
    clientName: dto.clientName,
    clientEmail: dto.clientEmail,
    serviceId: new Types.ObjectId(dto.serviceId),
    submissionSource: dto.submissionSource,
    reviewToken: token,
    clientLocation:dto.clientLocation,
  });

 const reviewLink = `${process.env.NEXT_PUBLIC_BASE_URL}/review/submission/${token}`;


  /* -------------------------------
     EMAIL FLOW
  -------------------------------- */
  if (dto.submissionSource === "email" && dto.clientEmail) {
    const html = renderReviewInviteEmail({
      clientName: dto.clientName,
      reviewLink,
    });

    await sendMail({
      to: dto.clientEmail,
      subject: "We’d love your feedback on our service",
      html,
    });

    return { token, reviewLink, emailed: true };
  }

  /* -------------------------------
     DIRECT LINK FLOW
  -------------------------------- */
  return { token, reviewLink, emailed: false };
}

/* ===============================================
   ADMIN → Find Review by ID
   =============================================== */

export async function findReviewById(
  reviewId: string
): Promise<ReviewRecord | null> {
  await db();

  console.log("Service Layer reviewID: ",reviewId);

  return reviewRepository.findById(new Types.ObjectId(reviewId));
}


/* =================================================
   PUBLIC → Validate Review Token
   ================================================= */

export async function validateReviewToken(
  token: string
): Promise<ReviewRecord> {
  await db();

  const record = await reviewRepository.findByToken(token);

  if (!record) {
    throw new Error("Invalid or expired review link.");
  }

  if (record.expiresAt && record.expiresAt < new Date()) {
    throw new Error("Review link has expired.");
  }

  if (record.submittedAt) {
    throw new Error("Review already submitted.");
  }


  return record;
}

/* =================================================
   PUBLIC → Submit Client Review
   ================================================= */

export async function submitClientReview(
  dto: SubmitReviewDTO
): Promise<ReviewRecord> {
  await db();

  const record = await validateReviewToken(dto.token);

  if (record.rating || record.message) {
    throw new Error("Review already submitted.");
  }

  if (dto.rating < 1 || dto.rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const avatar =
    record.clientEmail
      ? getGravatarUrl(record.clientEmail, 120)
      : undefined;

      console.log("Avater JO save hoga: ",avatar);

  const updated = await reviewRepository.submitReviewByToken(dto.token, {
    rating: dto.rating,
    message: dto.message,
    clientLocation: dto.clientLocation,
    submittedAt: new Date(),
    clientAvatar: avatar,
  });

  if (!updated) {
    throw new Error("Failed to submit review.");
  }

  return updated;
}

/* =================================================
   ADMIN → List Reviews
   ================================================= */

export async function getAdminReviews(filters?: {
  status?: "pending" | "approved" | "rejected";
  isFeatured?: boolean;
  serviceId?: string;
}): Promise<ReviewRecord[]> {
   
  await db();
  const query: any = {};

  if (filters?.status) query.status = filters.status;
  if (filters?.isFeatured !== undefined)
    query.isFeatured = filters.isFeatured;
  if (filters?.serviceId)
    query.serviceId = new Types.ObjectId(filters.serviceId);

  return reviewRepository.findAll(query);
}

/* =================================================
   ADMIN → Moderate Review
   ================================================= */

export async function moderateReview(
  reviewId: string,
  dto: UpdateReviewModerationDTO
): Promise<ReviewRecord> {
  await db();

  const record = await reviewRepository.updateModeration(
    new Types.ObjectId(reviewId),
    dto
  );

  if (!record) {
    throw new Error("Review not found.");
  }

  return record;
}

/* =================================================
   ADMIN → Soft Delete Review
   ================================================= */

export async function deleteReview(
  reviewId: string
): Promise<void> {
  await db();

  const success = await reviewRepository.softDelete(
    new Types.ObjectId(reviewId)
  );

  if (!success) {
    throw new Error("Failed to delete review.");
  }
}
