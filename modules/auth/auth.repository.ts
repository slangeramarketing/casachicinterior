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
/***************************************************
 * File: modules/auth/auth.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Fetch user data required for authentication
 *
 * Responsibilities:
 * - DB read operations only
 * - Return internal auth-safe structure
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT expose full User document
 ***************************************************/

import UserModel from "@/modules/users/user.model";
import type { AuthUserInternal } from "./auth.types";
import { AppError } from "@/lib/errors/AppError";

export const authRepository = {
  /**
   * Purpose:
   * - Find user by email with password hash
   *
   * Returns:
   * - AuthUserInternal | null
   */
  async findByEmailWithPassword(
    email: string
  ): Promise<AuthUserInternal | null> {
    try {
      const user = await UserModel.findOne({ email })
        .select("_id email password role status")
        .lean()
        .exec();

      if (!user || !user.password) {
        return null;
      }

      return {
        id: user._id.toString(),
        email: user.email,
        passwordHash: user.password,
        role: user.role,
        status: user.status,
      };
    } catch (err) {
      throw new AppError({
        message: "Failed to fetch user for authentication",
        code: "AUTH_USER_FETCH_FAILED",
        statusCode: 500,
        context: { email },
        cause: err,
      });
    }
  },
};
