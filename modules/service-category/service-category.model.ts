/***************************************************
 * File: modules/service-categories/service-category.model.ts
 * Layer: Model
 *
 * Purpose:
 * - Defines MongoDB schema for Service Categories
 *
 * Responsibilities:
 * - Store service categories and sub-categories
 * - Support parent-child hierarchy using parentId
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT contain validation rules beyond schema-level
 * - Must NOT export anything except the Mongoose model
 ***************************************************/

import { Schema, model, models, Types } from "mongoose";

/* -------------------------------------
   Service Category Schema
------------------------------------- */
const ServiceCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    
    // UI/Visuals
    description: { type: String, trim: true }, // Category ka short intro
    icon: { type: String }, // Icon Picker ID (Jaise Service module mein hai)
    thumbnail: { type: String }, // Category image for the list grid

    // Hierarchy
    parentId: {
      type: Types.ObjectId,
      ref: "ServiceCategory",
      default: null,
      index: true,
    },

    // SEO
    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
    },

    // Admin Controls
    displayOrder: { type: Number, default: 0, index: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

/* -------------------------------------
   Model Export
------------------------------------- */
export const ServiceCategoryModel =
  models.ServiceCategory ||
  model("ServiceCategory", ServiceCategorySchema);
