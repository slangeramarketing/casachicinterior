/***************************************************
 * File: modules/locations/location.model.ts
 * Layer: Model
 *
 * Purpose:
 * - MongoDB schema for location landing pages
 * - One record per slug (unique index)
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT contain validation beyond schema-level
 * - Must NOT export anything except the Mongoose model
 ***************************************************/

import { Schema, model, models } from "mongoose";
import {
  DEFAULT_LOCATION_CTA_LINK,
  DEFAULT_LOCATION_CTA_TEXT,
  DEFAULT_LOCATION_META_ROBOTS,
  LOCATION_META_ROBOTS_OPTIONS,
  LOCATION_STATUSES,
} from "./location.constants";

const ProjectSchema = new Schema(
  {
    title: { type: String, default: "", trim: true },
    locality: { type: String, default: "", trim: true },
    flatSize: { type: String, default: "", trim: true },
    scope: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const BudgetSchema = new Schema(
  {
    label: { type: String, default: "", trim: true },
    range: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const TestimonialSchema = new Schema(
  {
    name: { type: String, default: "", trim: true },
    locality: { type: String, default: "", trim: true },
    text: { type: String, default: "", trim: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
  },
  { _id: false }
);

const FaqSchema = new Schema(
  {
    question: { type: String, default: "", trim: true },
    answer: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const LocationSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    areaName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    intro: { type: String, default: "", trim: true },
    heroImage: { type: String, default: "", trim: true },

    localities: { type: [String], default: [] },
    serviceIds: { type: [String], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    budgets: { type: [BudgetSchema], default: [] },
    testimonials: { type: [TestimonialSchema], default: [] },
    faqs: { type: [FaqSchema], default: [] },

    ctaText: { type: String, default: DEFAULT_LOCATION_CTA_TEXT, trim: true },
    ctaLink: { type: String, default: DEFAULT_LOCATION_CTA_LINK, trim: true },

    metaTitle: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", trim: true },
    keywords: { type: [String], default: [] },
    metaRobots: {
      type: String,
      enum: LOCATION_META_ROBOTS_OPTIONS,
      default: DEFAULT_LOCATION_META_ROBOTS,
    },

    status: {
      type: String,
      enum: LOCATION_STATUSES,
      default: "draft",
      index: true,
    },

    updatedBy: { type: String, default: "", trim: true },
  },
  { timestamps: true, versionKey: false }
);

export const LocationModel = models.Location || model("Location", LocationSchema);
