/***************************************************
 * File: modules/design-process/design-process.model.ts
 * Layer: Model
 *
 * Purpose:
 * - Defines MongoDB schema for Design Process steps
 *
 * Responsibilities:
 * - Store ordered process steps
 * - Link process to a Service (optional but recommended)
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT contain validation beyond schema-level
 ***************************************************/

import { Schema, Types, model, models } from "mongoose";

/* -------------------------------------
   Design Process Step Schema
------------------------------------- */
const DesignProcessSchema = new Schema(
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
       Step Content
    --------------------------- */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    /* ---------------------------
       Optional Media
    --------------------------- */
    icon: {
      type: String, // icon name or image URL
      trim: true,
    },

    /* ---------------------------
       Ordering
    --------------------------- */
    stepOrder: {
      type: Number,
      required: true,
      index: true,
    },

    /* ---------------------------
       Visibility
    --------------------------- */
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
export const DesignProcessModel =
  models.DesignProcess ||
  model("DesignProcess", DesignProcessSchema);
