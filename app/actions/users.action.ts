"use server";

/***************************************************
 * File: app/admin/actions/users.actions.ts
 * Layer: Server Action (Admin)
 *
 * Purpose:
 * - Admin-facing server actions for User module
 *
 * Responsibilities:
 * - Call userServer facade only
 *
 * Restrictions:
 * - No DB access
 * - No business logic
 * - No auth logic (handled in userServer)
 ***************************************************/

import { userServer } from "@/modules/users/user.server";
import {
  UserCreateDTO,
  UserUpdateDTO,
  UserStatus,
} from "@/modules/users/user.dto";
import { getAuthUser } from "@/lib/auth";
import { userRepository } from "@/modules/users/user.repository";

/* =========================
   CREATE
========================= */
export async function createUserAction(
  data: UserCreateDTO
) {
  return userServer.create(data);
}

/* =========================
   UPDATE
========================= */
export async function updateUserAction(
  userId: string,
  data: UserUpdateDTO
) {
  return userServer.update(userId, data);
}

/* =========================
   UPDATE STATUS
========================= */
export async function updateUserStatusAction(
  userId: string,
  status: UserStatus
) {
  return userServer.updateStatus(userId, status);
}

/* =========================
   DELETE
========================= */
export async function deleteUserAction(
  userId: string
) {
  return userServer.delete(userId);
}


/**
 * Purpose:
 * - Return authenticated user's PUBLIC profile
 *
 * Returns:
 * - null if not authenticated
 * - { id, email, name, role }
 */
export async function getAuthenticatedUser() {
  const jwt = await getAuthUser();

  if (!jwt) return null;

  const user = await userServer.getById(jwt.userId);

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}