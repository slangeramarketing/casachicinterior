"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BiCategory } from "react-icons/bi";

import { BlogDTO } from "@/types/blogs";

import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown from "@/components/common/FilterDropdown";
import CreateButton from "@/components/common/CreateButton";
import BlogCard from "@/components/admin/BlogCard";
import { timeAgo } from "@/lib/utils/timeAgo";

/* =========================
   PROPS
========================= */
interface BlogListProps {
  blogs: BlogDTO[];
}

/* =========================
   COMPONENT
========================= */
export default function BlogList({ blogs }: BlogListProps) {
  const router = useRouter();

  const [filter, setFilter] = useState<"az" | "za" | "new" | "old">("new");
  const [search, setSearch] = useState("");

  /* -------------------------------------
     Search + Filter Logic
  ------------------------------------- */
  const filteredBlogs = useMemo(() => {
    let data = [...blogs];

    if (search) {
      data = data.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (filter) {
      case "az":
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        data.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "new":
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
        break;
      case "old":
        data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        );
        break;
    }

    return data;
  }, [blogs, filter, search]);

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-6 px-8">
      {/* ================= Header ================= */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between pt-2">
          <PageRouteHeader />

          <div className="flex gap-2">
            <CreateButton
              label="Add"
              onClick={() => router.push("/admin/blogs/create")}
              className="text-white py-4"
            />
            <FilterDropdown
              value={filter}
              onChange={setFilter}
              options={[
                { label: "A to Z", value: "az" },
                { label: "Z to A", value: "za" },
                { label: "New", value: "new" },
                { label: "Old", value: "old" },
              ]}
            />
          </div>
        </div>

        <div className="w-full flex justify-between">
          <PageTitle
            title="Blogs"
            description="Manage all blogs from here"
          />

          <SearchInput onChange={setSearch} className="w-1/2" />
        </div>
      </div>

      {/* ================= Blog Cards ================= */}
      {filteredBlogs.length === 0 ? (
        <div className="text-gray-500">No blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog._id}
              thumbnail={blog.thumbnailImage}
              category={blog.subCategory}
              title={blog.title}
              description={blog.description}
              createdAt={timeAgo(blog.createdAt)}
              updatedAt={timeAgo(blog.updatedAt)}
              href={`/admin/blogs/${blog._id}`}
              wrapperClassName="border border-gray-300 rounded-md overflow-hidden bg-white"
              imageWrapperClassName="border-b border-gray-300"
              imageClassName="w-full h-[220px] object-cover"
              contentClassName="p-4 space-y-2"
              categoryClassName="text-sm font-semibold text-orange-500"
              titleClassName="text-lg font-bold text-gray-900 leading-snug"
              metaClassName="text-xs text-gray-500"
              descriptionClassName="text-sm text-gray-700"
              readMoreClassName="text-sm font-semibold text-orange-500 hover:underline"
            />
          ))}
        </div>
      )}
    </div>
  );
}
