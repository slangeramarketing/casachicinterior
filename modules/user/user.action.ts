"use server";

import { getAuthUser } from "@/lib/auth-server";
import {
  registerUser,
  updateUser,
  setUserBlockStatus,
  deleteUser,
} from "./user.service";

import {
  AdminCreateUserDTO,
  AdminUpdateUserDTO,
} from "./dto/user.input.dto";

/* -------------------------------------
   Internal helper (role guard)
------------------------------------- */
function assertAdmin(authUser: Awaited<ReturnType<typeof getAuthUser>>) {
  if (!authUser) {
    throw new Error("Unauthorized");
  }

  if (authUser.role !== "admin" && authUser.role !== "super_admin") {
    throw new Error("Forbidden");
  }
}

/* -------------------------------------
   CREATE USER (ADMIN)
------------------------------------- */
export async function createUserAction(
  data: AdminCreateUserDTO
) {
  const authUser = await getAuthUser();
  assertAdmin(authUser);

  return await registerUser(data);
}

/* -------------------------------------
   UPDATE USER (ADMIN)
------------------------------------- */
export async function updateUserAction(
  userId: string,
  data: AdminUpdateUserDTO
) {
  const authUser = await getAuthUser();
  assertAdmin(authUser);

  return await updateUser(userId, data);
}

/* -------------------------------------
   BLOCK / UNBLOCK USER (ADMIN)
------------------------------------- */
export async function blockUserAction(
  userId: string,
  block: boolean
) {
  const authUser = await getAuthUser();
  assertAdmin(authUser);

  return await setUserBlockStatus(userId, block);
}

/* -------------------------------------
   DELETE USER (ADMIN)
------------------------------------- */
export async function deleteUserAction(userId: string) {
  const authUser = await getAuthUser();
  assertAdmin(authUser);

  await deleteUser(userId);
}
