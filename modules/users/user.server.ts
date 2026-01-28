/***************************************************
 * File: modules/users/user.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Acts as Next.js–specific server adapter for Users module
 *
 * Responsibilities:
 * - Perform authentication checks
 * - Call appropriate service methods
 * - Apply mapper before returning data
 *
 * Restrictions:
 * - Must NOT access repository directly
 * - Must NOT contain business logic
 * - Must NOT format data
 ***************************************************/

import { getAuthUser } from "@/lib/auth";
import { AppError } from "@/lib/errors/AppError";

import {
  createUser,
  updateUserBySuperAdmin,
  updateSelfProfile,
  deleteUser,
  listUsers,
  countUsers,
  getUserById,
} from "./user.service";

import { userMapper } from "./user.mapper";

import {
  UserCreateDTO,
  UserUpdateDTO,
  UserFilterDTO,
  AdminSelfUpdateDTO,
} from "./user.dto";

export const userServer = {
  /* ============================
     CREATE USER (SUPER ADMIN)
  ============================ */
  async create(data: UserCreateDTO) {
    const authUser = await getAuthUser();
    if (!authUser) {
      throw new AppError({
        message: "Authentication required",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }

    const record = await createUser(authUser.role, data);
    return userMapper.toResponse(record);
  },

  /* ============================
     UPDATE USER (SUPER ADMIN)
  ============================ */
  async updateBySuperAdmin(
    userId: string,
    data: UserUpdateDTO
  ) {
    const authUser = await getAuthUser();
    if (!authUser) {
      throw new AppError({
        message: "Authentication required",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }

    const record = await updateUserBySuperAdmin(
      authUser.role,
      userId,
      data
    );

    return userMapper.toResponse(record);
  },

  /* ============================
     UPDATE SELF PROFILE (ADMIN / SUPER ADMIN)
  ============================ */
  async updateSelf(
    data: AdminSelfUpdateDTO
  ) {
    const authUser = await getAuthUser();
    if (!authUser) {
      throw new AppError({
        message: "Authentication required",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }

    const record = await updateSelfProfile(
      authUser.role,
      authUser.userId,
      data
    );

    return userMapper.toResponse(record);
  },

  /* ============================
     DELETE USER (SUPER ADMIN)
  ============================ */
  async delete(userId: string) {
    const authUser = await getAuthUser();
    if (!authUser) {
      throw new AppError({
        message: "Authentication required",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }

    await deleteUser(authUser.role, userId);
  },

  /* ============================
     LIST USERS (SUPER ADMIN)
  ============================ */
  async list(filters: UserFilterDTO) {
    const authUser = await getAuthUser();
    if (!authUser) {
      throw new AppError({
        message: "Authentication required",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }

    const records = await listUsers(
      authUser.role,
      filters
    );

    return userMapper.toResponseList(records);
  },

  /* ============================
     COUNT USERS (SUPER ADMIN)
  ============================ */
  async count(filters: UserFilterDTO) {
    const authUser = await getAuthUser();
    if (!authUser) {
      throw new AppError({
        message: "Authentication required",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }

    return countUsers(authUser.role, filters);
  },

  /* ============================
     GET USER BY ID
  ============================ */
  async getById(userId: string) {
    const authUser = await getAuthUser();
    if (!authUser) {
      throw new AppError({
        message: "Authentication required",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }

    const record = await getUserById(
      authUser.role,
      userId
    );

    return userMapper.toResponse(record);
  },
};
