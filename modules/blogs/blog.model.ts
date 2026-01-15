/***************************************************
 * File: modules/blogs/blog.model.ts
 * Layer: Model
 *
 * Purpose:
 * - Defines MongoDB schema for Blog
 *
 * Responsibilities:
 * - Schema definition only
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT contain hooks with domain rules
 ***************************************************/

import mongoose, { Schema, Types } from "mongoose";

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
    },

    richText: {
      type: String,
    },

    thumbnailImage: {
      type: String,
    },

    /**
     * Category reference
     */
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    /**
     * SubCategory reference
     * (must belong to the selected category – enforced in service layer)
     */
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    /**
     * Author (Admin/User)
     */
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seo: {
      metaTitle: {
        type: String,
      },
      metaDescription: {
        type: String,
      },
    },

    /**
     * Published timestamp
     * (set by service layer, NOT here)
     */
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Blog ||
  mongoose.model("Blog", BlogSchema);
