/***************************************************
 * File: modules/service-showcase/service-showcase.model.ts
 * Layer: Model
 *
 * Purpose:
 * - Defines MongoDB schema for Service Before/After Showcase
 *
 * Responsibilities:
 * - Store service-specific portfolio showcases
 * - Support before/after slider + case study content
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT contain validation beyond schema-level
 * - Must NOT export anything except the Mongoose model
 ***************************************************/

import { Schema, Types, model, models } from "mongoose";

/* -------------------------------------
   Service Showcase Schema
------------------------------------- */
const ServiceShowcaseSchema = new Schema(
  {
    /* ---------------------------
       Association
    --------------------------- */
    serviceId: {
      type: Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },

    /* ---------------------------
       Core Content
    --------------------------- */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* ---------------------------
       Before / After Images
    --------------------------- */
    beforeImage: {
      type: String,
      required: true,
    },

    afterImage: {
      type: String,
      required: true,
    },

    /* ---------------------------
       Case Study
    --------------------------- */
    problem: {
      type: String,
      required: true,
    },

    solution: {
      type: String,
      required: true,
    },

    result: {
      type: String,
      required: true,
    },

    /* ---------------------------
       Ordering & Visibility
    --------------------------- */
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* -------------------------------------
   Model Export
------------------------------------- */
export const ServiceShowcaseModel =
  models.ServiceShowcase ||
  model("ServiceShowcase", ServiceShowcaseSchema);
