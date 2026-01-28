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
 * - No repository access
 * - No business logic
 ***************************************************/

import { userServer } from "@/modules/users/user.server";
import {
  UserCreateDTO,
  UserUpdateDTO,
  UserFilterDTO,
  AdminSelfUpdateDTO,
} from "@/modules/users/user.dto";
import { getAuthUser } from "@/lib/auth";

/* =========================
   CREATE (SUPER ADMIN)
========================= */
export async function createUserAction(
  data: UserCreateDTO
) {
  return userServer.create(data);
}

/* =========================
   UPDATE USER (SUPER ADMIN)
========================= */
export async function updateUserBySuperAdminAction(
  userId: string,
  data: UserUpdateDTO
) {
  return userServer.updateBySuperAdmin(userId, data);
}

/* =========================
   UPDATE SELF PROFILE (ADMIN / SUPER ADMIN)
========================= */
export async function updateSelfProfileAction(
  data: AdminSelfUpdateDTO
) {
  return userServer.updateSelf(data);
}

/* =========================
   DELETE USER (SUPER ADMIN)
========================= */
export async function deleteUserAction(
  userId: string
) {
  return userServer.delete(userId);
}

/* =========================
   LIST USERS (SUPER ADMIN)
========================= */
export async function listUsersAction(
  filters: UserFilterDTO
) {
  return userServer.list(filters);
}

/* =========================
   COUNT USERS (SUPER ADMIN)
========================= */
export async function countUsersAction(
  filters: UserFilterDTO
) {
  return userServer.count(filters);
}

/* =========================
   GET USER BY ID
========================= */
export async function getUserByIdAction(
  userId: string
) {
  return userServer.getById(userId);
}

/* =========================
   GET AUTHENTICATED USER (PUBLIC PROFILE)
========================= */
/**
 * Purpose:
 * - Return authenticated user's public profile
 *
 * Notes:
 * - Used by AdminHeader / Layout
 * - Returns null if unauthenticated
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
    profile: user.profile,
  };
}
