/***************************************************
 * File: modules/projects/project.controller.ts
 * Layer: Controller
 *
 * Purpose:
 * - Public / mobile APIs
 ***************************************************/

import { NextResponse } from "next/server";
import { getProjectsService } from "./project.service";
import { mapProjectToResponse } from "./project.mapper";

export async function getProjectsController() {
  const data = await getProjectsService();
  return NextResponse.json(data.map(mapProjectToResponse));
}
