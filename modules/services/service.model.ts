/***************************************************
 * File: modules/services/service.model.ts
 * Layer: Model
 *
 * Purpose:
 * - Defines MongoDB schema for Service module
 *
 * Responsibilities:
 * - Declare Mongoose schema structure
 * - Enforce data shape at database level
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT contain validation rules beyond schema-level
 * - Must NOT export anything except the Mongoose model
 ***************************************************/

import { Schema, Types, model, models } from "mongoose";

/* -------------------------------------
   Service Schema
------------------------------------- */
const ServiceSchema = new Schema(
  {
    /* ---------------------------
       Core Identity
    --------------------------- */
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* ---------------------------
       Content
    --------------------------- */
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    /* ---------------------------
       Category Reference (IMPORTANT)
    --------------------------- */
    categoryId: {
      type: Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
      index: true,
    },

    /* ---------------------------
       Media
    --------------------------- */
    coverImage: {
      type: String,
      required: true,
    },

    gallery: {
      type: [String],
      default: [],
    },

    /* ---------------------------
       Business Value
    --------------------------- */
    highlights: {
      type: [String],
      required: true,
      default: [],
    },

    /* ---------------------------
       SEO & Marketing
    --------------------------- */
    seoTitle: {
      type: String,
      trim: true,
    },

    seoDescription: {
      type: String,
      trim: true,
    },

    seoKeywords: {
      type: [String],
      default: [],
    },

    /* ---------------------------
       Admin Controls
    --------------------------- */
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },

    /* ---------------------------
       CTA
    --------------------------- */
    ctaText: {
      type: String,
      trim: true,
    },

    ctaLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
    versionKey: false,
  }
);

/* -------------------------------------
   Model Export
------------------------------------- */
export const ServiceModel =
  models.Service || model("Service", ServiceSchema);
