"use client";

import { useState, ReactNode } from "react";
import { FiBell, FiMenu } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Sidebar from "@/components/admin/Sidebar";
import "../globals.css";

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-white text-gray-800 overflow-hidden">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static z-30
          h-full w-[250px] bg-white border-r border-gray-200
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 px-6 lg:px-12 flex items-center justify-between lg:justify-end border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-2xl text-gray-700"
          >
            <FiMenu />
          </button>

          <div className="flex items-center gap-6 text-xl text-gray-700">
            <FiBell size={22} />
            <FaUserCircle size={28} />
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-2 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
