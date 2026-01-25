// app/admin/blogs/page.tsx
import BlogList from "@/components/admin/clientComponent/blogs/BlogList";
import { blogServer } from "@/modules/blogs/blog.server";

export default async function AdminBlogsPage() {
  const result = await blogServer.getAll();

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
      />
    </div>
  );
}