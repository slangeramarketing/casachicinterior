// modules/projects/project.model.ts

import { PROJECT_TYPES } from "@/shared/projectTypes";
import mongoose, { Schema, Model, Document } from "mongoose";

/* =========================
   TIMELINE SUB TYPE
========================= */
interface ProjectTimeline {
  startDate?: Date | null;
  endDate?: Date | null;
}

/* =========================
   DOCUMENT TYPE
========================= */
export interface ProjectDocument extends Document {
  title: string;
  description: string;

  thumbnail?: string | null;
  ImageGallery: string[];
  video?: string;

  techStack: string[];
  skills: mongoose.Types.ObjectId[]; // 🔑 RELATION

  category:string;

  subCategory:string;

  projectType:string;


  problemSolved?: string;
  purpose?: string;

  timeline?: ProjectTimeline;

  projectUrl?: string;
  githubUrl?: string;
  externalUrl?: string;

  isFeatured: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================
   SCHEMA
========================= */
const ProjectSchema = new Schema<ProjectDocument>(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    thumbnail: {
      type: String,
      default: null,
    },

    ImageGallery: {
      type: [String],
      default: [],
    },

    video: {
      type: String,
      default: "",
    },

    techStack: {
      type: [String],
      required: true,
    },

    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
        required: true,
        default: [],   // ✅ hard guarantee
      },
    ],

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    projectType: {
      type: String,
      enum: PROJECT_TYPES,
      required: true,
    },


    problemSolved: { type: String, default: "" },
    purpose: { type: String, default: "" },

    timeline: {
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
    },

    projectUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    externalUrl: { type: String, default: "" },

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* =========================
   MODEL
========================= */
const ProjectModel: Model<ProjectDocument> =
  mongoose.models.Project ||
  mongoose.model<ProjectDocument>("Project", ProjectSchema);

export default ProjectModel;
