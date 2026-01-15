/***************************************************
 * File: modules/users/user.controller.ts
 * Layer: Controller
 *
 * Purpose:
 * - HTTP API endpoints for mobile / external clients
 *
 * Responsibilities:
 * - Handle request & response
 * - Call service layer
 * - Apply mapper
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT access repository directly
 ***************************************************/

import { NextRequest, NextResponse } from "next/server";
import { userService } from "./user.service";
import { userMapper } from "./user.mapper";
import { getAuthUser } from "@/lib/auth";
import { parseUserRole, parseUserStatus } from "./user.dto";

/**
 * GET /api/users
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const filters = {
      role: parseUserRole(searchParams.get("role")),
      status: parseUserStatus(searchParams.get("status")),
      search: searchParams.get("search") ?? undefined,
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 10),
    };


    const records = await userService.listUsers(
      authUser.role,
      filters
    );

    return NextResponse.json(
      userMapper.toResponseList(records)
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}

/**
 * POST /api/users
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const record = await userService.createUser(
      authUser.role,
      body
    );

    return NextResponse.json(
      userMapper.toResponse(record),
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
