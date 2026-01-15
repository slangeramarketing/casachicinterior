/* ---------------------------------------
   modules/auth/auth.mapper.ts
---------------------------------------- */

// import { UserRecord } from "../users/user.typs";
import { AuthUserDTO } from "./auth.dto";
import { AuthUserInternal } from "./auth.types";

/**
 * Map User mongoose document → Auth-safe DTO
 */
export function mapAuthUser(user: AuthUserInternal): AuthUserDTO {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
