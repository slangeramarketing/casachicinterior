/***************************************************
 * File: modules/reviews/review.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Handles all database operations for Review module
 *
 * Responsibilities:
 * - Create review token records
 * - Fetch reviews by token or filters
 * - Update review submission and moderation state
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT import DTOs
 * - Must NOT format or map data
 ***************************************************/

import { UpdateReviewModerationDTO } from "./review.dto";
import { ReviewModel } from "./review.model";
import { ReviewRecord } from "./review.types";
import { Types } from "mongoose";

export const reviewRepository = {
  /**
   * Purpose:
   * - Create initial review record when admin generates link
   *
   * Used By:
   * - Service layer
   */
  async createTokenRecord(data: {
    clientName: string;
    clientEmail?: string;
    clientAvatar?:string;
    serviceId: Types.ObjectId;
    submissionSource: "email" | "direct_link";
    reviewToken: string;
    expiresAt?: Date;
    clientLocation?:String
  }): Promise<ReviewRecord> {
    const doc = await ReviewModel.create({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientAvatar:data.clientAvatar,
      serviceId: data.serviceId,
      submissionSource: data.submissionSource,
      reviewToken: data.reviewToken,
      expiresAt: data.expiresAt,
      status: "pending",
      clientLocation:data.clientLocation
    });

    return doc.toObject();
  },

  /**
   * Purpose:
   * - Find review by unique token
   *
   * Used By:
   * - Service (validation + submission)
   */
  async findByToken(token: string): Promise<ReviewRecord | null> {
    return ReviewModel.findOne({
      reviewToken: token,
      isDeleted: false,
    }).lean();
  },

  /**
   * Purpose:
   * - Update review when client submits feedback
   *
   * Used By:
   * - Service layer
   */
  async submitReviewByToken(
    token: string,
    update: {
      rating: number;
      message: string;
      clientLocation?: string;
      submittedAt: Date;
      clientAvatar?:string
    }
  ): Promise<ReviewRecord | null> {
    return ReviewModel.findOneAndUpdate(
      {
        reviewToken: token,
        isDeleted: false,
      },
      {
        rating: update.rating,
        message: update.message,
        clientLocation: update.clientLocation,
        submittedAt: update.submittedAt,
        clientAvatar:update.clientAvatar,
      },
      { new: true }
    ).lean();
  },

  /**
   * Purpose:
   * - Fetch all reviews for admin listing
   *
   * Used By:
   * - Admin dashboard
   */
  async findAll(filter: {
    status?: "pending" | "approved" | "rejected";
    serviceId?: Types.ObjectId;
    isFeatured?: boolean;
  } = {}): Promise<ReviewRecord[]> {
    return ReviewModel.find({
      ...filter,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean();
  },

  /**
   * Purpose:
   * - Find review by ID
   *
   * Used By:
   * - Service layer
   */
  async findById(id: Types.ObjectId): Promise<ReviewRecord | null> {
    const reviewData= await ReviewModel.findOne({
      _id: id,
      isDeleted: false,
    }).lean();
    return reviewData;
  },

  /**
   * Purpose:
   * - Update moderation fields (approve / reject / feature)
   *
   * Used By:
   * - Admin actions
   */
  async updateModeration(
  id: Types.ObjectId,
  update: UpdateReviewModerationDTO
): Promise<ReviewRecord | null> {
  return ReviewModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      ...(update.status && { status: update.status }),
      ...(update.isFeatured !== undefined && { isFeatured: update.isFeatured }),
      ...(update.adminResponse !== undefined && {
        adminResponse: update.adminResponse,
      }),
      ...(update.clientLocation !== undefined && {
        clientLocation: update.clientLocation,
      }),
      ...(update.clientAvatar !== undefined && {
        clientAvatar: update.clientAvatar,
      }),
      ...(update.clientEmail !== undefined && {
        clientEmail: update.clientEmail,
      }),
    },
    { new: true }
  ).lean();
},

  /**
   * Purpose:
   * - Soft delete a review
   *
   * Used By:
   * - Admin delete action
   */
  async softDelete(id: Types.ObjectId): Promise<boolean> {
    const res = await ReviewModel.updateOne(
      { _id: id },
      { isDeleted: true }
    );

    return res.modifiedCount > 0;
  },
};
