/***************************************************
 * File: modules/projects/project.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Convert DB → Response DTO
 *
 * Responsibilities:
 * - ObjectId → string
 * - Date → ISO
 * - Normalize optional DB fields
 *
 * Restrictions:
 * - No DB access
 * - No business logic
 ***************************************************/

import { ProjectDB } from "./project.types";
import { ProjectResponseDTO } from "./project.dto";

export function mapProjectToResponse(
  data: ProjectDB
): ProjectResponseDTO {
  return {
    id: data._id.toString(),

    title: data.title,
    description: data.description,

    thumbnail: data.thumbnail ?? null,
    ImageGallery: data.ImageGallery ?? [],
    video: data.video ?? "",

    techStack: data.techStack,

    // ✅ FIX: ObjectId[] → string[]
    skills: data.skills.map((id) => id.toString()),

    category: data.category,
    subCategory: data.subCategory,

    projectType: data.projectType,

    // ✅ FIX: normalize optional strings
    problemSolved: data.problemSolved ?? "",
    purpose: data.purpose ?? "",

    // ✅ FIX: timeline safety
    timeline: {
      startDate: data.timeline?.startDate
        ? data.timeline.startDate.toISOString()
        : null,
      endDate: data.timeline?.endDate
        ? data.timeline.endDate.toISOString()
        : null,
    },

    projectUrl: data.projectUrl ?? "",
    githubUrl: data.githubUrl ?? "",
    externalUrl: data.externalUrl ?? "",

    isFeatured: data.isFeatured,
    isActive: data.isActive,

    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
}
