"use client";

/***************************************************
 * File: app/auth/login/page.tsx
 * Purpose:
 * - Admin login UI
 * - PWA install entry point
 ***************************************************/

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiLogIn,
} from "react-icons/fi";


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

  /* -----------------------------
     Submit Handler
  ----------------------------- */
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

      if (
        data.user.role !== "admin" &&
        data.user.role !== "super_admin"
      ) {
        throw new Error("Access denied: Admin only");
      }

      setSuccess("Login successful");
      router.replace("/admin/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-gray-100">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-800">
            CasaChic Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Secure dashboard access
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg text-center">
            {success} · Redirecting…
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email
            </label>
            <div className="relative mt-1">
              <FiMail className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2.5 rounded-lg
                  bg-gray-50 border border-gray-300
                  focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2.5 rounded-lg
                  bg-gray-50 border border-gray-300
                  focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
              bg-orange-500 text-white font-bold
              hover:bg-orange-600 transition
              disabled:opacity-60"
          >
            <FiLogIn />
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* PWA INSTALL ENTRY POINT - Native browser prompt will handle this */}
      </div>
    </div>
  );
}
