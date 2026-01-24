/***************************************************
 * File: modules/reviews/review.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Defines input and output contracts for Review module
 *
 * Responsibilities:
 * - Describe data exchanged between UI ↔ server
 *
 * Restrictions:
 * - Must NOT use ObjectId
 * - Must NOT use Date objects
 * - Must NOT contain business logic
 ***************************************************/

/* =================================================
   ADMIN → Generate Review Link
   ================================================= */

// Admin creates a review request (email OR direct link)
export interface CreateReviewLinkDTO {
  clientName: string;
  clientEmail?: string; // Optional for direct link flow
  serviceId: string;
  submissionSource: "email" | "direct_link";
  clientLocation?:string;
}


/* =================================================
   CLIENT → Submit Review via Link
   ================================================= */

export interface SubmitReviewDTO {
  token: string;              // reviewToken
  rating: number;
  message: string;
  clientLocation?: string;
}


/* =================================================
   ADMIN → Moderate Review
   ================================================= */

export interface UpdateReviewModerationDTO {
  status?: "pending" | "approved" | "rejected"
  isFeatured?: boolean;
  adminResponse?: string;
  clientLocation?:string;
  
}


/* =================================================
   ADMIN → List / View Reviews (Response DTO)
   ================================================= */

export interface ReviewResponseDTO {
  id: string;

  clientName: string;
  clientEmail?: string;
  clientAvatar?: string;
  clientLocation?: string;

  rating?: number;
  message?: string;

  submissionSource: "email" | "direct_link";

  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;

  adminResponse?: string;

  serviceId: string;
  projectId?: string;

  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}
