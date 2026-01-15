/***************************************************
 * File: modules/projects/project.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Input & response contracts
 *
 * Restrictions:
 * - No ObjectId
 * - No Date objects
 ***************************************************/

import { ProjectType } from "@/shared/projectTypes";

export interface CreateProjectDTO {
  title: string;
  description: string;

  thumbnail?: string | null;
  ImageGallery?: string[];
  video?: string;

  techStack: string[];
  skills: string[]; // ✅ Skill IDs as string

  category: string;
  subCategory: string;

  projectType: ProjectType;

  problemSolved?: string;
  purpose?: string;

  timeline?: {
    startDate?: string | null;
    endDate?: string | null;
  };

  projectUrl?: string;
  githubUrl?: string;
  externalUrl?: string;

  isFeatured?: boolean;
  isActive:boolean
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  isActive?: boolean;
}

export interface ProjectResponseDTO {
  id: string;

  title: string;
  description: string;

  thumbnail?: string | null;
  ImageGallery: string[];
  video?: string;

  techStack: string[];
  skills: string[]; // ✅ Skill IDs as string

  category: string;
  subCategory: string;

  projectType: ProjectType;

  problemSolved: string;
  purpose: string;

  timeline: {
    startDate: string | null;
    endDate: string | null;
  };

  projectUrl: string;
  githubUrl: string;
  externalUrl: string;

  isFeatured: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
