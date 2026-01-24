/***************************************************
 * File: modules/auth/auth.controller.ts
 * Layer: Controller (Auth API)
 *
 * Purpose:
 * - Handle HTTP authentication requests
 *
 * Responsibilities:
 * - Parse request
 * - Call auth service
 * - Set auth cookies
 * - Return DTO-compliant JSON
 *
 * Restrictions:
 * - No business logic
 * - No DB access
 ***************************************************/

import { NextRequest, NextResponse } from "next/server";
import { loginService } from "./auth.service";
import type {
  LoginDTO,
  LoginResponseDTO,
  AuthErrorDTO,
} from "./auth.dto";

/**
 * Auth Controller
 */
export const authController = {
  /**
   * Purpose:
   * - Handle login HTTP request
   *
   * Used By:
   * - /api/auth/login
   *
   * Returns:
   * - LoginResponseDTO | AuthErrorDTO
   */
  async login(req: NextRequest) {
    try {
      const body = (await req.json()) as LoginDTO;
      console.log("login Request: ",body.email);

      const { token, user } = await loginService(body);

      const response: LoginResponseDTO = {
        success: true,
        user,
        message: "Login successful",
      };

      const res = NextResponse.json(response);

      res.cookies.set("auth_token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      return res;
    } catch (err) {
      console.log("Server SIDE ERROR: ",err);
      const message =
        err instanceof Error ? err.message : "LOGIN_FAILED";

      const errorResponse: AuthErrorDTO = {
        success: false,
        message,
      };

      return NextResponse.json(errorResponse, { status: 401 });
    }
  },

  /**
   * Purpose:
   * - Clear authentication cookie
   */
  async logout() {
    const res = NextResponse.json({ success: true });

    res.cookies.set("auth_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return res;
  },
};
