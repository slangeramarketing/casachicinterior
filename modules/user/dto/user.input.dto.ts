/*----------------------------------
        UI → API

----------------------------------
👉 Rule yaad rakho (important):
        Input DTO me sirf wahi fields hoti hain jo UI server ko bhejta hai
        ❌ _id, role, status, createdAt UI decide nahi karta
----------------------------------

-----------------------------------*/

import { UserRole, UserStatus } from "../user.model";

/*
  Use-case: Create account (Signup)
  UI user se kya data bhej sakta hai
*/

export interface CreateUserDTO {
        name?: string;
        email: string;
        password: string;
}

/*
  Use-case: Admin creates user
  (Dashboard / Admin Panel)
*/
export interface AdminCreateUserDTO {
        name?: string;
        email: string;
        password: string;
        role: UserRole; // 👈 ADMIN selects role
}


/*
   Use-case: Login
*/
export interface LoginUserDTO {
        email: string;
        password: string;
}

/*
  Use-case: Update profile (self)
*/
export interface UpdateUserProfileDTO {
        name?: string;
        email?: string;
}

// modules/user/dto/user.input.dto.ts
export interface AdminUpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus; // active | inactive | blocked
}


/*
  Use-case: Change password
*/
export interface ChangePasswordDTO {
        currentPassword: string;
        newPassword: string;
}