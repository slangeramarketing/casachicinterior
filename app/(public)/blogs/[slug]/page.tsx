import { notFound } from "next/navigation";
import { blogServer } from "@/modules/blogs/blog.server";
import PublicBlogDetail from "@/components/public/blogs-page/PublicBlogDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SingleBlogServerPage({ params }: Props) {
  const { slug } = await params;

  // 1. Fetch Main Blog Data
  const blogRes = await blogServer.getBySlug(slug);

  if (!blogRes.success || !blogRes.data) {
    notFound();
  }

  const blogData = blogRes.data;

  // 2. Fetch Related Blogs (Same Category)
  // Hum categoryId use karenge aur current blog ko ID se exclude karenge
  const relatedRes = await blogServer.getAll({
    categoryId: blogData.category.id, // Same category
    status: "published",             // Sirf published
    _id: { $ne: blogData.id }        // Current blog ko hata kar ($ne = Not Equal)
  });

  // Limit related blogs to top 4 (Service layer ya slice se handle karein)
  const relatedBlogs = (relatedRes.success && Array.isArray(relatedRes.data)) 
    ? relatedRes.data.slice(0, 4) 
    : [];

  return (
    <div className="min-h-screen bg-white">
      <PublicBlogDetail
        blog={blogData} 
        relatedBlogs={relatedBlogs} 
      />
    </div>
  );
}