/***************************************************
 * File: modules/seo/seo.model.ts
 * Layer: Model
 *
 * Purpose:
 * - MongoDB schema for dashboard-managed page SEO entries
 * - One record per public route (unique index on `route`)
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT contain validation beyond schema-level
 * - Must NOT export anything except the Mongoose model
 ***************************************************/

import { Schema, model, models } from "mongoose";
import {
  DEFAULT_META_ROBOTS,
  META_ROBOTS_OPTIONS,
  PAGE_SEO_STATUSES,
} from "./seo.constants";

const PageSeoSchema = new Schema(
  {
    route: { type: String, required: true, unique: true, index: true, trim: true },

    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },

    primaryKeyword: { type: String, default: "", trim: true },
    secondaryKeywords: { type: [String], default: [] },

    heading: { type: String, default: "", trim: true },

    canonicalUrl: { type: String, default: "", trim: true },
    ogImage: { type: String, default: "", trim: true },

    metaRobots: {
      type: String,
      enum: META_ROBOTS_OPTIONS,
      default: DEFAULT_META_ROBOTS,
    },

    status: {
      type: String,
      enum: PAGE_SEO_STATUSES,
      default: "draft",
      index: true,
    },

    updatedBy: { type: String, default: "", trim: true },
  },
  { timestamps: true, versionKey: false }
);

export const PageSeoModel = models.PageSeo || model("PageSeo", PageSeoSchema);
