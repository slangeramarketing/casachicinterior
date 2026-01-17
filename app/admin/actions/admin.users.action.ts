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
  UserFilterDTO,
  UserStatus,
} from "@/modules/users/user.dto";

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

/* =========================
   LIST
========================= */
export async function listUsersAction(
  filters: UserFilterDTO
) {
  return userServer.list(filters);
}

/* =========================
   GET BY ID
========================= */
export async function getUserByIdAction(
  userId: string
) {
  return userServer.getById(userId);
}

/* =========================
   COUNT
========================= */
export async function countUsersAction(
  filters: UserFilterDTO
) {
  return userServer.count(filters);
}
