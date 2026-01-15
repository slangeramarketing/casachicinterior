/***************************************************
 * File: modules/projects/project.action.ts
 * Layer: Action
 *
 * Purpose:
 * - Admin CRUD via Server Actions
 ***************************************************/

"use server";

import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import {
  createProjectService,
  updateProjectService,
  deleteProjectService,
} from "./project.service";
import { mapProjectToResponse } from "./project.mapper";
import { CreateProjectDTO, UpdateProjectDTO } from "./project.dto";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) throw new Error("UNAUTHORIZED");

  const payload = verifyJwt(token);
  if (!payload || payload.role !== "super_admin") {
    throw new Error("FORBIDDEN");
  }
}

export async function createProjectAction(dto: CreateProjectDTO) {
  await requireAdmin();
  const data = await createProjectService(dto);
  return mapProjectToResponse(data);
}

export async function updateProjectAction(
  id: string,
  dto: UpdateProjectDTO
) {
  await requireAdmin();
  const data = await updateProjectService(id, dto);
  return mapProjectToResponse(data);
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await deleteProjectService(id);
}
