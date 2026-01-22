import { Schema, Types, model, models } from "mongoose";

const ServiceSchema = new Schema(
  {
    /* ---------------------------
        Core Identity
    --------------------------- */
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true },

    /* ---------------------------
        Content & Structure
    --------------------------- */
    shortDescription: { type: String, required: true, trim: true },
    description: { type: Schema.Types.Mixed, required: true }, 

    // Updated: Now supports Icon ID + Title
    highlights: [{
      icon: { type: String, required: true }, // Stores ID like 'modular-kitchen'
      title: { type: String, required: true, trim: true }
    }],

    /* ---------------------------
        Category Reference
    --------------------------- */
    categoryId: { type: Types.ObjectId, ref: "ServiceCategory", required: true, index: true },

    /* ---------------------------
        Media (Optimized)
    --------------------------- */
    coverImage: { type: String, required: true },
    gallery: [{
      url: { type: String, required: true },
      alt: { type: String, default: "" }, 
      caption: { type: String }
    }],

  /* ---------------------------
        Video Showcase (Flexible & Safe)
    --------------------------- */
    videoShowcase: {
      reels: {
        type: [{
          url: { type: String, trim: true },
          thumbnail: { type: String },
          title: { type: String, trim: true }
        }],
        default: [] // Khali array default rakhein
      },
      youtube: {
        type: [{
          embedId: { type: String, trim: true },
          title: { type: String, trim: true },
          description: { type: String }
        }],
        default: [] // Khali array default rakhein
      }
    },

    /* ---------------------------
        FAQ (SEO Goldmine) 
    --------------------------- */
    faqs: [{
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }],

    /* ---------------------------
        Pricing & Estimation
    --------------------------- */
    startingPrice: { type: Number },
    priceUnit: { type: String, default: "sq ft" }, 

    /* ---------------------------
        SEO & Marketing
    --------------------------- */
    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      keywords: { type: [String], default: [] },
      ogImage: { type: String }, 
      metaRobots: { type: String, default: "index, follow" } 
    },

    /* ---------------------------
        Admin Controls
    --------------------------- */
    featured: { type: Boolean, default: false, index: true },
    status: { 
      type: String, 
      enum: ["draft", "published", "archived"], 
      default: "draft", 
      index: true 
    },
    displayOrder: { type: Number, default: 0, index: true },

    /* ---------------------------
        CTA
    --------------------------- */
    ctaText: { type: String, default: "Get Free Consultation" },
    ctaLink: { type: String, default: "/contact" },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: false
  }
);

export const ServiceModel = models.Service || model("Service", ServiceSchema);