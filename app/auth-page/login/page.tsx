"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";

/* -------------------------------------
   DTO: Login API Response
------------------------------------- */
interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: "admin" | "super_admin" | "user";
  };
  message?: string;
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------------------------------------
     Login Handler
  ------------------------------------- */
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      /* ❌ HTTP or business error */
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      /* 🔐 Admin-only UI check */
      if (
        data.user?.role !== "admin" &&
        data.user?.role !== "super_admin"
      ) {
        throw new Error("You are not allowed to access admin panel");
      }

      /* ✅ Cookie already set by backend */
      router.replace("/admin/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Secure access to dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            {error}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full pl-10 pr-3 py-2.5 rounded-md
                  bg-[#F2F2F2] border border-gray-300
                  text-gray-800 outline-none
                  focus:border-[#F97316]
                "
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full pl-10 pr-3 py-2.5 rounded-md
                  bg-[#F2F2F2] border border-gray-300
                  text-gray-800 outline-none
                  focus:border-[#F97316]
                "
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2.5 rounded-md
              bg-[#F97316] text-white font-semibold
              hover:bg-[#ea6a10] transition
              disabled:opacity-60
            "
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
