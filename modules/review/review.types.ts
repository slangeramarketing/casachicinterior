import { Types } from "mongoose";

/***************************************************
 * File: modules/reviews/review.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Represents raw Review records returned from MongoDB
 *
 * Responsibilities:
 * - Define plain DB record shape
 * - Used ONLY between repository ↔ service
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT contain DTOs
 * - Must NOT format data
 * - Must NOT use string IDs or ISO dates
 ***************************************************/

export interface ReviewRecord {
  _id: Types.ObjectId;

  // --- Client Details ---
  clientName: string;
  clientEmail?: string;
  clientAvatar?: string;
  clientLocation?: string;

  // --- Link Context ---
  reviewToken: string;
  submissionSource: "email" | "direct_link";

  // --- Connections ---
  serviceId: Types.ObjectId;
  projectId?: Types.ObjectId;

  // --- Review Content ---
  rating?: number;
  message?: string;
  submittedAt?: Date;

  // --- Admin Workflow ---
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  adminResponse?: string;

  // --- Soft Delete ---
  isDeleted: boolean;

  // --- Optional Security ---
  expiresAt?: Date;

  // --- Timestamps ---
  createdAt: Date;
  updatedAt: Date;
}
