"use client";

/***************************************************
 * File: app/auth/login/page.tsx
 * Layer: Client UI
 *
 * Purpose:
 * - Admin authentication UI
 *
 * Responsibilities:
 * - Collect credentials
 * - Call auth API
 * - Handle UI state only
 *
 ***************************************************/

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";

import type {
  LoginDTO,
  LoginResponseDTO,
  AuthErrorDTO,
} from "@/modules/auth/auth.dto";

type LoginAPIResponse = LoginResponseDTO | AuthErrorDTO;

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginDTO>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* -------------------------------------
     Submit Handler
  ------------------------------------- */
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: LoginAPIResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Authentication failed");
      }

      /* Admin-only access */
      if (
        data.user.role !== "admin" &&
        data.user.role !== "super_admin"
      ) {
        throw new Error("Access denied: Admin only");
      }

      setSuccess("Login successful");
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      console.log("AUth ERROR: ",err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-xl p-8 shadow-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Secure access to dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md flex justify-center items-center">
            {`${success} Redirecting...`}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="relative mt-1">
              <FiMail className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2.5 rounded-md
                  bg-[#F2F2F2] border border-gray-300
                  text-gray-800 outline-none
                  focus:border-[#F97316]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2.5 rounded-md
                  bg-[#F2F2F2] border border-gray-300
                  text-gray-800 outline-none
                  focus:border-[#F97316]"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md
              bg-[#F97316] text-white font-semibold
              hover:bg-[#ea6a10] transition
              disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* Future: Forgot Password */}
          <p className="text-center text-sm text-gray-500">
            Forgot password?{" "}
            <span className="text-[#F97316] cursor-pointer">
              Reset
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
