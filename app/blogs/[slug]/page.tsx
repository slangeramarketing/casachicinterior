
import SingleBlog from "@/components/clientPage/blogs/SingleBlog";
import { blogsData } from "@/lib/data/blogs/blog.data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return blogsData.map((project) => ({
    slug: project.slug,
  }));
}


export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
  }) {
    const {slug}= await params
    const blogs = blogsData.find(
      (item) => item.slug === slug
    );

    console.log("Blog-Slug: ",slug);
  
    if (!blogs) return notFound();
  return <SingleBlog blogs={blogsData} slug={slug} />;
}
