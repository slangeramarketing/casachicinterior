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

export const userServer = {
  /**
   * Create user
   */
  async create(data: UserCreateDTO) {
    const authUser = await getAuthUser();
    if (!authUser) throw new Error("Unauthorized");

    const record = await createUser(authUser.role, data);
    return userMapper.toResponse(record);
  },

  /**
   * Update user
   */
  async update(userId: string, data: UserUpdateDTO) {
    const authUser = await getAuthUser();
    if (!authUser) throw new Error("Unauthorized");

    const record = await updateUser(
      authUser.role,
      userId,
      data
    );

    return userMapper.toResponse(record);
  },

  /**
   * Update user status
   */
  async updateStatus(userId: string, status: UserStatus) {
    const authUser = await getAuthUser();
    if (!authUser) throw new Error("Unauthorized");

    const record = await updateUserStatus(
      authUser.role,
      userId,
      status
    );

    return userMapper.toResponse(record);
  },

  /**
   * Delete user (super_admin only)
   */
  async delete(userId: string) {
    const authUser = await getAuthUser();
    if (!authUser) throw new Error("Unauthorized");

    await deleteUser(authUser.role, userId);
  },

  /**
   * List users
   */
  async list(filters: UserFilterDTO) {
    const authUser = await getAuthUser();
    if (!authUser) throw new Error("Unauthorized");

    const records = await listUsers(
      authUser.role,
      filters
    );

    return userMapper.toResponseList(records);
  },

  /**
   * Get user by ID
   */
  async getById(userId: string) {
    const authUser = await getAuthUser();
    if (!authUser) throw new Error("Unauthorized");

    const record = await getUserById(
      authUser.role,
      userId
    );

    return userMapper.toResponse(record);
  },

  /**
   * Count users
   */
  async count(filters: UserFilterDTO) {
    const authUser = await getAuthUser();
    if (!authUser) throw new Error("Unauthorized");

    return countUsers(authUser.role, filters);
  },
};
