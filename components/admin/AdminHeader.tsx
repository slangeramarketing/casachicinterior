"use client";

import { useState } from "react";
import { FiBell, FiMenu, FiSearch } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

export default function AdminHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 md:hidden"
        />
      )}

      {/* HEADER */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-gray-200">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-2xl"
          >
            <FiMenu color="black" />
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6 text-xl">
          <button
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <FiSearch size={22} color="black" />
          </button>

          <div className="relative cursor-pointer">
            <FiBell size={22} color="black" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>

          <Link href="/admin/users/profile">
            <FaUserCircle size={30} color="gray" />
          </Link>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300
           bg-bg-primary
          ${searchOpen ? "max-h-20 py-3 px-4" : "max-h-0 py-0 px-4"}
        `}
      >
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 rounded-md border border-gray-300"
        />
      </div>
    </>
  );
}
