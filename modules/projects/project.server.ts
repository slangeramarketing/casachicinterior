/***************************************************
 * File: modules/projects/project.server.ts
 * Layer: Server Facade (Next.js Adapter)
 *
 * Purpose:
 * - Unified server-side handlers for Project module
 *
 * Used By:
 * - Server Components (READ operations)
 * - Server Actions (WRITE operations)
 *
 * Responsibilities:
 * - Call service layer
 * - Apply mapper at boundary
 * - Perform auth & role checks for mutations
 *
 * Restrictions:
 * - Must NOT access repository directly
 * - Must NOT contain business logic
 ***************************************************/

"use server";

import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

import {
  getProjectsService,
  createProjectService,
  updateProjectService,
  deleteProjectService,
  findProjectByIdService,
} from "./project.service";

import { mapProjectToResponse } from "./project.mapper";
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectResponseDTO,
} from "./project.dto";
import { findProjectTypeById } from "../projectTypes/projectType.repository";

/* =================================================
   INTERNAL AUTH GUARD
================================================= */

/**
 * Purpose:
 * - Ensure caller is authenticated admin
 *
 * Used By:
 * - Write handlers only
 *
 * Returns:
 * - void (throws error if unauthorized)
 */
async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const payload = verifyJwt(token);
  if (!payload || payload.role !== "super_admin") {
    throw new Error("FORBIDDEN");
  }
}

/* =================================================
   READ HANDLERS (Server Components)
================================================= */

/**
 * Purpose:
 * - Fetch all projects for UI consumption
 *
 * Used By:
 * - Admin pages
 * - Public pages
 *
 * Returns:
 * - Array of ProjectResponseDTO
 *
 * Notes:
 * - Mapper is applied here to avoid leaking DB types
 */
export async function getProjects(): Promise<ProjectResponseDTO[]> {
  const data = await getProjectsService();
  return data.map(mapProjectToResponse);
}

/* =================================================
   WRITE HANDLERS (Server Actions)
================================================= */

/**
 * Purpose:
 * - Create a new project (admin only)
 *
 * Used By:
 * - Admin dashboard forms
 *
 * Returns:
 * - Created project as ProjectResponseDTO
 */
export async function createProjectServer(
  dto: CreateProjectDTO
): Promise<ProjectResponseDTO> {
  await requireAdmin();

  const data = await createProjectService(dto);
  return mapProjectToResponse(data);
}


export async function getProjectByIdServer(
  id: string
): Promise<ProjectResponseDTO | null> {
  const data = await findProjectByIdService(id);
  if (!data) return null;

  return mapProjectToResponse(data);
}


/**
 * Purpose:
 * - Update an existing project (admin only)
 *
 * Used By:
 * - Admin dashboard edit forms
 *
 * Returns:
 * - Updated project as ProjectResponseDTO
 */
export async function updateProjectServer(
  id: string,
  dto: UpdateProjectDTO
): Promise<ProjectResponseDTO> {
  await requireAdmin();

  const data = await updateProjectService(id, dto);
  return mapProjectToResponse(data);
}

/**
 * Purpose:
 * - Delete a project permanently (admin only)
 *
 * Used By:
 * - Admin dashboard
 *
 * Returns:
 * - void
 */
export async function deleteProjectServer(id: string): Promise<void> {
  await requireAdmin();
  await deleteProjectService(id);
}



