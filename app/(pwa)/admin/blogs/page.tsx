// app/admin/blogs/page.tsx
import BlogList from "@/components/admin/clientComponent/blogs/BlogList";
import { getAuthUser } from "@/lib/auth";
import { blogServer } from "@/modules/blogs/blog.server";
import { redirect } from "next/navigation";

export default async function AdminBlogsPage() {
  const result = await blogServer.getAll();
  const user=await getAuthUser();
  if (!user) {
    redirect("/admin/login");
  }

  if (user.role !== "admin" && user.role !== "super_admin") {
    redirect("/admin/forbidden");
  }


  // Error handling
  if (!result.success) {
    return (
      <div className="p-10 text-center text-red-500">
        Error loading blogs: {result.error}
      </div>
    );
  }

  // Ab result.data ek Array hai (BlogResponseDTO[])
  return (
    <div className="p-3 md:p-4">
      <BlogList 
        blogs={result.data || []} 
        actorRole={user?.role}
      />
    </div>
  );
}