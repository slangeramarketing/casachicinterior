/* ---------------------------------------
   app/admin/users/layout.tsx
---------------------------------------- */

import { ReactNode } from "react";
import { requireRole } from "@/lib/auth";

export default async function UsersLayout({
  children,
}: {
  children: ReactNode;
}) {
  // ❗ ONLY super_admin allowed
  await requireRole(["super_admin"]);

  return <>{children}</>;
}
