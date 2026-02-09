// app/(pwa)/admin/page.tsx

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authorize } from "@/modules/auth/auth.middleware";

export default async function AdminRootPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        redirect("/auth/login");
    }

    const result = authorize(token, ["admin", "super_admin"]);

    if (!result.ok) {
        redirect("/auth/login");
    }

    redirect("/admin/home");
}
