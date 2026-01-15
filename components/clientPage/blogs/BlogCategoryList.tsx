"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PageRouteHeader,
  PageTitle,
} from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown, {
  FilterOption,
} from "@/components/common/FilterDropdown";
import CreateButton from "@/components/common/CreateButton";
import {
  FiChevronDown,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import { ResponseCategoryDTO } from "@/modules/blog-category/category.dto";
import { SubCategoryResponseDTO } from "@/modules/blog-subcategory/subcategory.dto";
import { MdCategory } from "react-icons/md";

interface BlogCategoryListProps {
  categories: ResponseCategoryDTO[];
  subCategories: SubCategoryResponseDTO[];
  onDeleteCategory: (id: string) => Promise<void>;
  onDeleteSubCategory: (id: string) => Promise<void>;
}

/* =====================================================
   Filters
===================================================== */
type StatusFilter = "all" | "active" | "inactive";

const FILTER_OPTIONS: FilterOption<StatusFilter>[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

/* =====================================================
   Component
===================================================== */
export default function BlogCategoryList({
  categories,
  subCategories,
  onDeleteCategory,
  onDeleteSubCategory,
}: BlogCategoryListProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<
    Record<string, boolean>
  >({});

  /* =====================================================
     Helpers
  ===================================================== */
  const matchesCategory = (c: ResponseCategoryDTO) => {
    const s =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase());

    const f =
      filter === "all"
        ? true
        : filter === "active"
        ? c.isActive
        : !c.isActive;

    return s && f;
  };

  const matchesSubCategory = (s: SubCategoryResponseDTO) => {
    const t =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase());

    const f =
      filter === "all"
        ? true
        : filter === "active"
        ? s.isActive
        : !s.isActive;

    return t && f;
  };

  /* =====================================================
     Build Tree (Category → SubCategory)
  ===================================================== */
  const tree = useMemo(() => {
    const map: Record<string, SubCategoryResponseDTO[]> =
      {};

    subCategories.forEach((s) => {
      map[s.categoryId] = map[s.categoryId] || [];
      map[s.categoryId].push(s);
    });

    return map;
  }, [subCategories]);

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="space-y-6">
     <div className="flex justify-between">
         <PageRouteHeader />
         <div className="flex gap-4">
            <CreateButton
                label="Add-Category"
                onClick={() =>
                router.push("/admin/blogs/categories/create")
                }
                className="py-4 text-white"
                icon={<MdCategory size={16} />}
            />
            <CreateButton
                label="Add-SubCategory"
                onClick={() =>
                router.push("/admin/blogs/subcategories/create")
                }
                className="py-4 text-white"
                icon={<MdCategory size={16} />}
            />
            <FilterDropdown
                value={filter}
                options={FILTER_OPTIONS}
                onChange={setFilter}
            />

         </div>
     </div>
      {/* Search + Filter */}
      <div className="grid grid-cols-2 items-center">
        <PageTitle
         title="Blog Categories"
         description="Manage blog categories and sub-categories"
        />
        <SearchInput
            value={search}
            placeholder="Search..."
            onChange={setSearch}
          />
      </div>

      {/* Tree */}
      <div className="bg-white flex flex-col gap-3 pb-4">
        {categories.length === 0 && (
          <div className="flex justify-center items-center text-sm text-gray-300 border min-h-75 border-dashed border-gray-200">
            Data Not Found
          </div>
        )}

        {categories.map((cat) => {
          const subs = tree[cat.id] || [];
          const isOpen = expanded[cat.id];

          if (
            !matchesCategory(cat) &&
            !subs.some(matchesSubCategory)
          ) {
            return null;
          }

          return (
            <div
              key={cat.id}
              className="border border-gray-300"
            >
              {/* Category */}
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={() =>
                    setExpanded((p) => ({
                      ...p,
                      [cat.id]: !p[cat.id],
                    }))
                  }
                  className="flex items-center gap-2"
                >
                  {subs.length > 0 ? (
                    isOpen ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )
                  ) : (
                    <span className="w-4" />
                  )}
                  <span className="font-medium">
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({cat.slug})
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      cat.isActive
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/blogs/categories/${cat.id}`
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              {/* SubCategories */}
              {isOpen && subs.length > 0 && (
                <div className="bg-gray-50">
                  {subs.map(
                    (s) =>
                      matchesSubCategory(s) && (
                        <div
                          key={s.id}
                          className="flex items-center justify-between px-10 py-2 text-sm hover:bg-white"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                            <span>{s.name}</span>
                            <span className="text-xs text-gray-400">
                              ({s.slug})
                            </span>
                            <span
                              className={`h-2 w-2 rounded-full ${
                                s.isActive
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/blogs/subcategories/${s.id}`
                                )
                              }
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <FiEdit2 size={13} />
                            </button>
                            <button
                              onClick={() =>
                                onDeleteSubCategory(s.id)
                              }
                              className="p-1 hover:bg-red-50 text-red-600 rounded"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
