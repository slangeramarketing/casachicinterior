/***************************************************
 * File: modules/auth/auth.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Fetch user data required for authentication
 *
 * Responsibilities:
 * - DB read operations only
 *

 ***************************************************/

import UserModel from "@/modules/users/user.model";
import type { AuthUserInternal } from "./auth.types";

export const authRepository = {
  /**
   * Purpose:
   * - Find user by email with password hash
   *
   * Used By:
   * - auth.service.ts
   *
   * Returns:
   * - AuthUserInternal | null
   */
  async findByEmailWithPassword(
    email: string
  ): Promise<AuthUserInternal | null> {
    const user = await UserModel.findOne({ email })
      .select("_id email password role status")
      .lean()
      .exec();

    if (!user || !user.password) return null;

    return {
      id: user._id.toString(),
      email:user.email,
      passwordHash:user.password,
      role:user.role,
      status: user.status,
    };
  },
};
