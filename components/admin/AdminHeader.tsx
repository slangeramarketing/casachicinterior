"use client";

import { useState } from "react";
import { FiBell, FiMenu, FiSearch, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import AdminSidebar from "./Sidebar"; // Sidebar import zaroori hai
import { getGravatarUrl } from "@/lib/utils/gravatar";
import Image from "next/image";

interface AdminHeaderProps {
  authUser: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
}

function getFirstName(name?: string) {
  if (!name) return "";
  return name.trim().split(" ")[0];
}



export default function AdminHeader({authUser}: AdminHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const avatarUrl = authUser?.email
    ? getGravatarUrl(authUser.email, 80)
    : "/media/static/default-avatar.png"; // optional fallback

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-[40] bg-black/50 md:hidden transition-opacity"
        />
      )}

      {/* MOBILE SIDEBAR (DRAWER) */}
      <div className={`fixed inset-y-0 left-0 z-[50] w-[280px] bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="h-16 flex items-center justify-between px-5 border-b">
          <span className="font-bold text-xl text-orange-500">Welcome, {getFirstName(authUser?.name)}</span>
          <button onClick={() => setSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)]" onClick={() => setSidebarOpen(false)}>
          <AdminSidebar />
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-10">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiMenu color="black" />
          </button>
          <div className="hidden md:block font-bold text-gray-500">
            Welcome, {getFirstName(authUser?.name)}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          {/* <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiBell size={22} color="black" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </div> */}

          {/* RIGHT */}
        <Link
          href="/admin/users/profile"
          className="flex items-center gap-2 hover:opacity-80"
        >
          <Image
            src={avatarUrl}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full border"
          />
        </Link>
        </div>
      </header>
    </>
  );
}