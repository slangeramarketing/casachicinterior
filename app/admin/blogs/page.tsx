import BlogList from "@/components/clientPage/blogs/BlogList";
import { blogServer } from "@/modules/blogs/blog.server";

export default async function AdminBlogsPage() {
  const blogs = await blogServer.getAll();

  return (
    <div>
      <BlogList blogs={blogs} />
    </div>
  );
}
