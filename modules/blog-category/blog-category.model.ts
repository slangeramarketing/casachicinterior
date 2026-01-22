import mongoose, { Schema, models, model } from "mongoose";

const BlogCategorySchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    description: { 
      type: String, 
      trim: true 
    },

      /**
       * Hierarchy Management (Self-Referencing)
       * Agar parentId null hai -> Main Category
       * Agar parentId mein kisi ID hai -> Sub-Category
       */
      parentId: {
        type: Schema.Types.ObjectId,
        ref: "BlogCategory",
        default: null,
        index: true
      },

    // Visuals (User-Friendly UI ke liye)
    icon: { type: String }, // e.g., Lucide icon name ya image URL
    coverImage: { type: String }, // Category page ke header ke liye

    // SEO Fields (Industry Standard)
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      keywords: [{ type: String }],
      metaRobots: { type: String, default: "index, follow" },
      canonicalUrl: { type: String }
    },

    // Status & Ordering
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true
    },
    displayOrder: { 
      type: Number, 
      default: 0 
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual: Check karne ke liye ki ye Sub-category hai ya nahi
 */
BlogCategorySchema.virtual("isSubCategory").get(function () {
  return this.parentId !== null;
});

// Model Export
export const BlogCategoryModel =
  models.BlogCategory || model("BlogCategory", BlogCategorySchema);