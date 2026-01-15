/***************************************************
 * File: modules/projects/project.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - MongoDB access for Projects
 *
 * Responsibilities:
 * - CRUD operations only
 * - Query-based filtering
 *
 * Restrictions:
 * - No DTOs
 * - No mappers
 * - No data normalization
 ***************************************************/

import ProjectModel from "./project.model";
import "@/modules/projectTypes/projectType.model"; // ✅ REGISTER MODEL
import { ProjectDB } from "./project.types";

/**
 * Purpose:
 * - Create a new project document
 */
export async function createProject(
  data: Partial<ProjectDB>
): Promise<ProjectDB> {
  const doc = await ProjectModel.create(data);
  return doc.toObject();
}

/**
 * Purpose:
 * - Get all projects (latest first)
 */
export async function getAllProjects(): Promise<ProjectDB[]> {
  const docs = await ProjectModel.find()
    .sort({ createdAt: -1 })
    .lean<ProjectDB[]>();   // ✅ THIS IS THE KEY

  return docs;
}


/**
 * Purpose:
 * - Find a project by its ID
 */
export async function findProjectById(
  id: string
): Promise<ProjectDB | null> {
  const doc = await ProjectModel.findById(id)
    .lean<ProjectDB | null>();   // ✅ KEY FIX

  return doc;
}

/**
 * Purpose:
 * - Find project by ID with populated ProjectType
 *
 * Used By:
 * - Service layer (read operations)
 *
 * Notes:
 * - Populates `projectType`
 * - Still returns raw DB shape (no DTO)
 */
export async function findProjectByIdWithProjectType(
  id: string
): Promise<ProjectDB | null> {
  const doc = await ProjectModel.findById(id)
    .populate("projectType") // 🔥 KEY DIFFERENCE
    .lean<ProjectDB | null>();

  console.log("Repository  layer Project Data: ",doc);
  return doc;
}



/**
 * Purpose:
 * - Update a project by ID
 */
export async function updateProject(
  id: string,
  data: Partial<ProjectDB>
): Promise<ProjectDB | null> {
  const doc = await ProjectModel.findByIdAndUpdate(id, data, {
    new: true,
  }).lean<ProjectDB | null>();   // ✅ correct

  return doc;
}


/**
 * Purpose:
 * - Delete a project by ID
 */
export async function deleteProject(id: string): Promise<void> {
  await ProjectModel.findByIdAndDelete(id);
}

/**
 * Purpose:
 * - Find projects related to a specific skill
 */
export async function findProjectsBySkill(
  skillId: string
): Promise<ProjectDB[]> {
  const docs = await ProjectModel.find({
    skills: skillId,
    isActive: true,
  }).lean<ProjectDB[]>();        // ✅ KEY FIX

  return docs;
}

/**
 * Purpose:
 * - Count active projects related to a skill
 */
export async function countProjectsBySkill(
  skillId: string
): Promise<number> {
  return ProjectModel.countDocuments({
    skills: skillId,
    isActive: true,
  });
}
