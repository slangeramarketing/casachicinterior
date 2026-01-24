import mongoose, { Schema, models, model } from "mongoose";

/***************************************************
 * File: modules/reviews/review.model.ts
 * Layer: Model
 *
 * Purpose:
 * - Defines MongoDB schema for client reviews
 * - Supports admin-generated review links (email / direct)
 *
 * Responsibilities:
 * - Schema definition only
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT generate tokens
 * - Must NOT validate workflows
 ***************************************************/

const ReviewSchema = new Schema(
  {
    // --- Client Details ---
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional: only present when admin has email
    clientEmail: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },

    // Avatar URL or Gravatar hash (optional)
    clientAvatar: {
      type: String,
      default: "",
    },

    clientLocation: {
      type: String,
      trim: true,
    },

    // --- Link Context ---
    // Mandatory unique token used for review submission
    reviewToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // How the review link was shared
    submissionSource: {
      type: String,
      enum: ["email", "direct_link"],
      required: true,
    },

    // --- Connections ---
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },

    // Future expansion (optional)
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },

    // --- Review Content ---
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      trim: true,
      maxLength: 1000,
    },

    // Actual time when client submits review
    submittedAt: {
      type: Date,
    },

    // --- Admin Workflow ---
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    adminResponse: {
      type: String,
      trim: true,
    },

    // --- Soft Delete ---
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    // --- Optional Security ---
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// --- Indexes ---
ReviewSchema.index({ serviceId: 1, status: 1 });
ReviewSchema.index({ createdAt: -1 });

export const ReviewModel =
  models.Review || model("Review", ReviewSchema);
