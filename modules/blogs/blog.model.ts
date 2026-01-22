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
  import mongoose, { Schema, models, model } from "mongoose";

  const BlogSchema = new Schema(
    {
      // --- Basic Information ---
      title: { 
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
      summary: { 
        type: String, 
        trim: true,
        maxLength: 500 // SEO snippet/Card description ke liye
      },
      content: { 
        type: String, // Rich Text (HTML or Markdown string)
        required: true 
      },

      // --- Media ---
      thumbnail: { type: String }, // List view image
      bannerImage: { type: String }, // Blog detail header image

      // --- Taxonomy (References) ---
      categoryId: { 
        type: Schema.Types.ObjectId, 
        ref: "BlogCategory", 
        required: true, 
        index: true 
      },

      // Sub-category check hum service layer mein parentId se handle kar lenge
      tags: [{ type: String, trim: true }], 

      // --- Engagement & Metadata ---
      authorId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", // Admin ya Writer ka reference
        required: true 
      },
      readingTime: { type: Number }, // Minutes mein (Service layer calculate karega)
      viewCount: { type: Number, default: 0 },

      // --- Advanced SEO ---
      seo: {
        metaTitle: { type: String },
        metaDescription: { type: String },
        keywords: [String],
        ogImage: { type: String }, // Social media sharing image
        canonicalUrl: { type: String },
        metaRobots: { type: String, default: "index, follow" }
      },

      // --- Status & Control ---
      status: { 
        type: String, 
        enum: ["draft", "published"], 
        default: "draft",
        index: true 
      },
      featured: { type: Boolean, default: false },
      publishedAt: { type: Date }, // Actual publish date
    },
    { 
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );

  // --- Indexes for Performance ---
  BlogSchema.index({ title: "text", summary: "text" }); // Full-text search ke liye

  export const BlogModel = models.Blog || model("Blog", BlogSchema);