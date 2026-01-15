/* ---------------------------------------
   modules/auth/auth.dto.ts
---------------------------------------- */

/* =========================
   INPUT DTOs
========================= */

/**
 * Login request payload
 */
export interface LoginDTO {
  email: string;
  password: string;
}



/* =========================
   OUTPUT DTOs
========================= */

/**
 * Minimal user info returned after login
 * (Never expose password or internal fields)
 */
export interface AuthUserDTO {
  id: string;
  email: string;
  role: "super_admin" | "admin" | "user";
}

/**
 * Login response payload (controller → client)
 */
export interface LoginResponseDTO {
  success: true;
  user: AuthUserDTO;
  message:string;
}

/**
 * Generic auth error shape (optional but clean)
 */
export interface AuthErrorDTO {
  success: false;
  message: string;
}
