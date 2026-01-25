/* ---------------------------------------
   app/admin/layout.tsx
---------------------------------------- */

import { ReactNode } from "react";
import { requireRole } from "@/lib/auth";

import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAuthenticatedUser } from "../actions/users.action";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 🔐 SERVER-SIDE AUTH CHECK
  await requireRole(["admin", "super_admin"]);

  const authUser=await getAuthenticatedUser();

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* SIDEBAR */}
      <div className="hidden md:block w-[250px] border-r border-gray-200">
        <AdminSidebar />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <AdminHeader authUser={authUser} />

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto lg:p-6 ">
          {children}
        </div>
      </div>
    </div>
  );
}
