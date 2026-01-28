/***************************************************
 * File: modules/users/user.server.ts
 * Layer: Server Facade
 ***************************************************/

import { getAuthUser } from "@/lib/auth";
import {
  createUser,
  updateUser,
  updateUserStatus,
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
  UserStatus,
} from "./user.dto";
import { AppError } from "@/lib/errors/AppError";

export const userServer = {
  /* ============================
     CREATE
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
     UPDATE
  ============================ */
  async update(userId: string, data: UserUpdateDTO) {
    const authUser = await getAuthUser();
    if (!authUser) {
      throw new AppError({
        message: "Authentication required",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }

    const record = await updateUser(
      authUser.role,
      userId,
      data
    );

    return userMapper.toResponse(record);
  },

  /* ============================
     UPDATE STATUS
  ============================ */
  async updateStatus(userId: string, status: UserStatus) {
    const authUser = await getAuthUser();
    if (!authUser) {
      throw new AppError({
        message: "Authentication required",
        code: "UNAUTHORIZED",
        statusCode: 401,
      });
    }

    const record = await updateUserStatus(
      authUser.role,
      userId,
      status
    );

    return userMapper.toResponse(record);
  },

  /* ============================
     DELETE
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
     LIST
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
     GET BY ID
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

  /* ============================
     COUNT
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
};
