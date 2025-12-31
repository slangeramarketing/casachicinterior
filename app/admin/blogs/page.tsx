import BlogList from "@/components/clientPage/BlogList";
import { getAllBlogsService } from "@/modules/blogs/blog.service";
import { BlogDTO } from "@/types/blogs";

export default async function AdminBlogsPage() {
  const blogs: BlogDTO[] = await getAllBlogsService();

  return (
    <div>
      <BlogList blogs={blogs} />
    </div>
  );
}
