"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MdCategory, MdAdd, MdPostAdd } from "react-icons/md";

import { PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown from "@/components/common/FilterDropdown";
import CreateButton from "@/components/common/CreateButton";
import BlogCard from "@/components/admin/clientComponent/blogs/BlogCard";
import { timeAgo } from "@/lib/utils/timeAgo";
import { BlogResponseDTO } from "@/modules/blogs/blog.dto";
import { getGravatarUrl } from "@/lib/utils/gravatar";
import { deleteBlogPostAction } from "@/app/actions/blog.action";
import { UserRole } from "@/modules/users/user.dto";

interface BlogListProps {
  blogs: BlogResponseDTO[];
  actorRole: UserRole;
}

export default function BlogList({ blogs, actorRole }: BlogListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"az" | "za" | "new" | "old">("new");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isSuperAdmin = actorRole === "super_admin";


  /* --- Search + Filter Logic --- */
  const filteredBlogs = useMemo(() => {
    let data = [...blogs];

    if (search) {
      data = data.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (filter) {
      case "az": data.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "za": data.sort((a, b) => b.title.localeCompare(a.title)); break;
      case "new": data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "old": data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
    }

    return data;
  }, [blogs, filter, search]);

  async function handleDelete(id: string) {
    return await deleteBlogPostAction(id);
  };

  return (
    <div className="space-y-6 lg:px-8 py-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col pb-4">
        <PageTitle
          title="Blog Management"
          description={`Showing ${filteredBlogs.length} posts`}
        />
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white py-4 md:p-4 md:rounded-xl md:shadow-sm md:border md:border-gray-100 border-b">
          <SearchInput
            onChange={setSearch}
            className="w-full md:w-1/2"
            placeholder="Search blogs by title..."
          />
          <div className="w-full flex gap-2 md:justify-end justify-items-start ">
            {/* 📂 Category button — only super_admin */}
            {isSuperAdmin && (
              <CreateButton
                label=""
                onClick={() => router.push("/admin/blogs/categories")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-4"
                icon={<MdCategory size={18} />}
              />
            )}

            {/* ➕ Create Blog — only super_admin */}
            {isSuperAdmin && (
              <CreateButton
                label=""
                onClick={() => router.push("/admin/blogs/create")}
                className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200 py-4"
                icon={<MdPostAdd size={18} />}
              />
            )}
            <FilterDropdown
              value={filter}
              onChange={setFilter}
              options={[
                { label: "Newest First", value: "new" },
                { label: "Oldest First", value: "old" },
                { label: "Title A-Z", value: "az" },
                { label: "Title Z-A", value: "za" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* --- Content Section --- */}
      {filteredBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <p className="text-gray-400 font-medium italic">No blog posts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              showAuthor={true}
              authorName={blog.author?.name}
              showActions={isSuperAdmin}
              // Agar email available hai toh use karein, nahi toh ID se identicon banayein
              authorAvatar={blog.author?.image || getGravatarUrl(blog.author?.id || "default")}
              thumbnail={blog.thumbnail || ""}
              category={blog.category?.name || "Uncategorized"}
              featured={blog.featured}
              title={blog.title}
              description={blog.summary || ""}
              createdAt={timeAgo(blog.createdAt)}
              updatedAt={timeAgo(blog.updatedAt)}
              href={`/admin/blogs/view/${blog.slug}`}
              onEdit={() => router.push(`/admin/blogs/${blog.id}`)}
              onDelete={() => handleDelete(blog.id)}




              wrapperClassName="group h-full flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              imageWrapperClassName="relative aspect-video overflow-hidden"
              imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              contentClassName="p-5 flex flex-col flex-grow"
              categoryClassName="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-orange-50 text-orange-600 mb-3"
              titleClassName="text-lg font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors"
              metaClassName="flex items-center gap-2 text-xs text-gray-400 mt-auto pt-4"
              descriptionClassName="text-sm text-gray-500 line-clamp-2 my-2"
              readMoreClassName="hidden" // Handled by href
            />


          ))}


        </div>
      )}
    </div>
  );
}