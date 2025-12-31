import mongoose, { Schema, Document } from "mongoose";

/* -------------------------------------
   SUB TYPES
------------------------------------- */
interface IIncludeItem {
  image: string;
  title: string;
}

interface IProcessStep {
  icon: string;
  step: number;
  title: string;
  description: string;
}

/* -------------------------------------
   SERVICE INTERFACE
------------------------------------- */
export interface IService extends Document {
  title: string;
  slug: string;

  shortDescription: string;
  overview: string;

  coverImage: string;
  galleryImages: string[];

  includes: IIncludeItem[];
  processSteps: IProcessStep[];

  featured: boolean;
  isActive: boolean;

  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

/* -------------------------------------
   SERVICE SCHEMA
------------------------------------- */
const ServiceSchema = new Schema<IService>(
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
      index: true,
    },

    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },

    overview: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    galleryImages: {
      type: [String],
      default: [],
    },

    /* -------- INCLUDES -------- */
    includes: [
      {
        image: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    /* -------- PROCESS STEPS -------- */
    processSteps: [
      {
        icon: {
          type: String,
          required: true,
        },
        step: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    seo: {
      metaTitle: {
        type: String,
        trim: true,
      },
      metaDescription: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------
   MODEL EXPORT
------------------------------------- */
export default mongoose.models.Service ||
  mongoose.model<IService>("Service", ServiceSchema);
