/***************************************************
 * File: modules/projects/project.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Represent raw MongoDB Project data
 *
 * Responsibilities:
 * - Exact persisted DB shape (DB-reality, not UI-ideal)
 *
 * Restrictions:
 * - No string dates
 * - No DTO exposure
 ***************************************************/

import { ProjectType } from "@/shared/projectTypes";
import { Types } from "mongoose";

export interface ProjectTimelineDB {
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface ProjectDB {
  _id: Types.ObjectId;

  title: string;
  description: string;

  thumbnail?: string | null;
  ImageGallery?: string[];
  video?: string;

  techStack: string[];
  skills: Types.ObjectId[];

  category: string;
  subCategory: string;

  projectType: ProjectType;

  problemSolved?: string;   // ✅ FIX
  purpose?: string;         // ✅ FIX

  timeline?: ProjectTimelineDB; // ✅ FIX

  projectUrl?: string;      // ✅ FIX
  githubUrl?: string;       // ✅ FIX
  externalUrl?: string;     // ✅ FIX

  isFeatured: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
