"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown, { FilterOption } from "@/components/common/FilterDropdown";
import CreateButton from "@/components/common/CreateButton";
import { FiChevronDown, FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdCategory } from "react-icons/md";

import { ResponseCategoryDTO } from "@/modules/blog-category/category.dto";
import { SubCategoryResponseDTO } from "@/modules/blog-subcategory/subcategory.dto";
import ConfirmActionDialog from "@/components/admin/ConfirmActionDialogProps";
import { RiDeleteBin6Line } from "react-icons/ri";

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
  const [filter, setFilter] = useState<StatusFilter>("all");
  
  // Multiple expansion handle karne ke liye array state
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /* =====================================================
      Filtering Logic (Fixed for isActive boolean)
  ===================================================== */
  const filteredData = useMemo(() => {
    return categories
      .filter((cat) => {
        const matchesSearch = cat.name.toLowerCase().includes(search.toLowerCase());
        
        // Filter logic for boolean isActive
        const matchesStatus = 
          filter === "all" || 
          (filter === "active" && cat.isActive) || 
          (filter === "inactive" && !cat.isActive);

        return matchesSearch && matchesStatus;
      })
      .map((cat) => ({
        ...cat,
        // Category ke andar related subcategories filter karna
        subs: subCategories.filter(
          (sub) => 
            sub.categoryId === cat.id && 
            sub.name.toLowerCase().includes(search.toLowerCase()) &&
            (filter === "all" || 
             (filter === "active" && sub.isActive) || 
             (filter === "inactive" && !sub.isActive))
        ),
      }));
  }, [categories, subCategories, search, filter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageRouteHeader />
        <div className="flex gap-4">
          <CreateButton
            label="Add-Category"
            onClick={() => router.push("/admin/blogs/categories/create")}
            className="py-4 text-white"
            icon={<MdCategory size={16} />}
          />
          <CreateButton
            label="Add-SubCategory"
            onClick={() => router.push("/admin/blogs/subcategories/create")}
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

      <div className="bg-white flex flex-col gap-3 pb-4">
        {filteredData.length === 0 ? (
          <div className="flex justify-center items-center text-sm text-gray-300 border min-h-75 border-dashed border-gray-200">
            Data Not Found
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            {filteredData.map((category) => (
              <div key={category.id} className="flex flex-col">
                {/* Category Row */}
                <div className="flex justify-between p-4 border border-gray-300">
                  <div className="flex gap-4 items-center">
                    <FiChevronDown
                      size={20}
                      onClick={() => toggleExpand(category.id)}
                      className={`transition-transform duration-300 cursor-pointer ${
                        expandedIds.includes(category.id) ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                    <h3 className="font-semibold">{category.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${category.isActive ? "bg-green-600" : "bg-gray-400"}`}></span> 
                      <p className="text-xs">({category.isActive ? "Active" : "Inactive"})</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span 
                      onClick={() => router.push(`/admin/blogs/categories/update/${category.id}`)}
                      className="hover:bg-gray-200 p-1 rounded hover:text-black cursor-pointer text-gray-400"
                    >
                      <FiEdit2 size={16} />
                    </span>

                    <ConfirmActionDialog
                      title="Delete Category"
                      description="This Category will be permanently deleted. This action cannot be undone."
                      confirmText="Delete"
                      danger
                      action={() => onDeleteCategory(category.id)}
                      trigger={
                          <button
                          title="Delete"
                          className="hover:bg-red-600 p-1 rounded hover:text-white cursor-pointer text-red-500"
                          >
                          <RiDeleteBin6Line size={15} />
                          </button>
                      }
                    />
                  </div>
                </div>

                {/* Sub-Category List Wrapper */}
                {expandedIds.includes(category.id) && (
                  <div className="border border-gray-300 flex flex-col ml-10 px-4 bg-gray-50 transition-all">
                    {category.subs.length > 0 ? (
                      category.subs.map((sub) => (
                        <div key={sub.id} className="flex gap-4 p-2 justify-between border-b border-gray-200 text-sm">
                          <div className="flex gap-4 items-center">
                            <h3>{sub.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${sub.isActive ? "bg-green-600" : "bg-gray-400"}`}></span> 
                              <p className="text-xs">({sub.isActive ? "Active" : "Inactive"})</p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <span 
                              onClick={() => router.push(`/admin/blogs/subcategories/update/${sub.id}`)}
                              className="hover:bg-gray-200 p-1 rounded hover:text-black cursor-pointer text-gray-400"
                            >
                              <FiEdit2 size={16} />
                            </span>

                            <ConfirmActionDialog
                              title="Delete Sub-Category"
                              description="This Sub-Category will be permanently deleted. This action cannot be undone."
                              confirmText="Delete"
                              danger
                              action={() => onDeleteSubCategory(sub.id)}
                              trigger={
                                  <button
                                  title="Delete"
                                  className="hover:bg-red-600 p-1 rounded hover:text-white cursor-pointer text-red-500"
                                  >
                                  <RiDeleteBin6Line size={15} />
                                  </button>
                              }
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-gray-400 italic">No sub-categories found</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}