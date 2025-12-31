import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth-server";
import AdminShell from "./AdminShell";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  /*
    🔐 Server-side auth check
  */
  const authUser = await getAuthUser();

  if (
    !authUser ||
    (authUser.role !== "admin" &&
      authUser.role !== "super_admin")
  ) {
    redirect("/auth-page/login");
  }

  /*
    ✅ Auth passed → render client shell
  */
  return <AdminShell>{children}</AdminShell>;
}
