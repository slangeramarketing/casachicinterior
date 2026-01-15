/***************************************************
 * File: modules/projects/project.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Business rules for Projects
 *
 * Restrictions:
 * - No formatting
 * - No mapper
 ***************************************************/

import { Types } from "mongoose";
import {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  findProjectByIdWithProjectType,
} from "./project.repository";
import { CreateProjectDTO, UpdateProjectDTO } from "./project.dto";
import { ProjectDB } from "./project.types";
import dbConnect from "@/lib/db";

/**
 * Purpose:
 * - Create a new project with validated relations
 *
 * Used By:
 * - Action layer (admin create)
 *
 * Returns:
 * - Raw ProjectDB object (Mongo shape)
 */
export async function createProjectService(
  dto: CreateProjectDTO
): Promise<ProjectDB> {
   await dbConnect();
  /* =========================
     BASIC VALIDATION
  ========================= */
  if (!dto.title?.trim()) {
    throw new Error("TITLE_REQUIRED");
  }

  if (!dto.description?.trim()) {
    throw new Error("DESCRIPTION_REQUIRED");
  }


  if (!dto.skills || dto.skills.length === 0) {
    throw new Error("AT_LEAST_ONE_SKILL_REQUIRED");
  }


  /* =========================
     PREPARE DB PAYLOAD
  ========================= */
  const payload: Partial<ProjectDB> = {
    title: dto.title.trim(),
    description: dto.description.trim(),

    thumbnail: dto.thumbnail ?? null,
    ImageGallery: dto.ImageGallery ?? [],
    video: dto.video ?? "",

    techStack: dto.techStack,
    skills: dto.skills.map((id) => new Types.ObjectId(id)),

    category: dto.category,
    subCategory: dto.subCategory,

    projectType: dto.projectType,

    problemSolved: dto.problemSolved ?? "",
    purpose: dto.purpose ?? "",

    timeline: dto.timeline
      ? {
          startDate: dto.timeline.startDate
            ? new Date(dto.timeline.startDate)
            : null,
          endDate: dto.timeline.endDate
            ? new Date(dto.timeline.endDate)
            : null,
        }
      : undefined,

    projectUrl: dto.projectUrl ?? "",
    githubUrl: dto.githubUrl ?? "",
    externalUrl: dto.externalUrl ?? "",

    isFeatured: dto.isFeatured ?? false,
    isActive: true,
  };

  /* =========================
     CREATE PROJECT
  ========================= */
  return createProject(payload);
}

export async function getProjectsService(): Promise<ProjectDB[]> {
 await dbConnect();
  return getAllProjects();
}

/**
 * Purpose:
 * - Fetch single project by ID with Project type populate data
 *
 * Used By:
 * - project.server.ts
 * - Server Pages
 */
export async function findProjectByIdService(
  id: string
): Promise<ProjectDB | null> {
  await dbConnect();

  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error("INVALID_PROJECT_ID");
  }

  return findProjectByIdWithProjectType(id);
}





export async function updateProjectService(
  id: string,
  dto: UpdateProjectDTO
): Promise<ProjectDB> {
  if (!id) {
    throw new Error("PROJECT_ID_REQUIRED");
  }

  const updateData: Partial<ProjectDB> = {};

  /* =========================
     BASIC FIELDS (SAFE)
  ========================= */
  if (dto.title !== undefined)
    updateData.title = dto.title.trim();

  if (dto.description !== undefined)
    updateData.description = dto.description.trim();

  if (dto.thumbnail !== undefined)
    updateData.thumbnail = dto.thumbnail;

  if (dto.ImageGallery !== undefined)
    updateData.ImageGallery = dto.ImageGallery;

  if (dto.video !== undefined)
    updateData.video = dto.video;

  if (dto.techStack !== undefined)
    updateData.techStack = dto.techStack;

  if (dto.category !== undefined)
    updateData.category = dto.category;

  if (dto.subCategory !== undefined)
    updateData.subCategory = dto.subCategory;

  if (dto.projectType !== undefined)
    updateData.projectType = dto.projectType;

  if (dto.problemSolved !== undefined)
    updateData.problemSolved = dto.problemSolved;

  if (dto.purpose !== undefined)
    updateData.purpose = dto.purpose;

  if (dto.projectUrl !== undefined)
    updateData.projectUrl = dto.projectUrl;

  if (dto.githubUrl !== undefined)
    updateData.githubUrl = dto.githubUrl;

  if (dto.externalUrl !== undefined)
    updateData.externalUrl = dto.externalUrl;

  if (dto.isFeatured !== undefined)
    updateData.isFeatured = dto.isFeatured;

  if (dto.isActive !== undefined)
    updateData.isActive = dto.isActive;

  /* =========================
     RELATIONS
  ========================= */
  if (dto.skills !== undefined) {
    updateData.skills = dto.skills.map(
      (id) => new Types.ObjectId(id)
    );
  }

  /* =========================
     TIMELINE (DTO → DB)
  ========================= */
  if (dto.timeline !== undefined) {
    updateData.timeline = {
      startDate: dto.timeline.startDate
        ? new Date(dto.timeline.startDate)
        : null,
      endDate: dto.timeline.endDate
        ? new Date(dto.timeline.endDate)
        : null,
    };
  }

  /* =========================
     UPDATE
  ========================= */
  const updated = await updateProject(id, updateData);

  if (!updated) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  return updated;
}



export async function deleteProjectService(
  id: string
): Promise<void> {
  await deleteProject(id);
}
