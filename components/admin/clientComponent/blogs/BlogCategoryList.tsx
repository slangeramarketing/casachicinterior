"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Next.js Image component

// --- UI Components ---
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown, { FilterOption } from "@/components/common/FilterDropdown";
import CreateButton from "@/components/common/CreateButton";
import { ConfirmAlert } from "@/components/common/ConfirmAlert";
import defaultImg from "@/public/assets/default.jpg"; // Default image placeholder

// --- Icons ---
import { FiChevronDown, FiEdit2,FiTrash2 } from "react-icons/fi";
import { MdCategory, MdOutlineCategory } from "react-icons/md";

// --- Logic & Actions ---
import { BlogCategoryResponseDTO } from "@/modules/blog-category/blog-category.dto";
import { deleteBlogCategoryAction } from "@/app/actions/blog-category.action";

type StatusFilter = "all" | "active" | "inactive";

const FILTER_OPTIONS: FilterOption<StatusFilter>[] = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function BlogCategoryList({ categories }: { categories: BlogCategoryResponseDTO[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    setAlertOpen(false);
    startTransition(async () => {
      const result = await deleteBlogCategoryAction(selectedId);
      if (result.success) {
        // Aap yahan apna Alert component bhi dikha sakte hain
      }
      setSelectedId(null);
    });
  };

  const filteredData = useMemo(() => {
    const filterTree = (list: BlogCategoryResponseDTO[]): BlogCategoryResponseDTO[] => {
      return list
        .filter((item) => {
          const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
          const matchesStatus = filter === "all" || item.status === filter;
          const hasMatchingChildren = item.children && filterTree(item.children).length > 0;
          return (matchesSearch && matchesStatus) || hasMatchingChildren;
        })
        .map((item) => ({
          ...item,
          children: item.children ? filterTree(item.children) : [],
        }));
    };
    return filterTree(categories);
  }, [categories, search, filter]);

  /* Recursive Row Renderer */
  const renderCategoryRow = (category: BlogCategoryResponseDTO, level: number = 0) => {
    const isExpanded = expandedIds.includes(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id} className="flex flex-col w-full">
        <div 
          className={`flex justify-between items-center p-3 border-b border-gray-100 hover:bg-orange-50/30 transition-colors ${
            level > 0 ? "bg-gray-50/40" : "bg-white"
          } ${isPending ? "opacity-50 pointer-events-none" : ""}`}
          style={{ paddingLeft: `${level * 2 + 1}rem` }}
        >
          <div className="flex items-center gap-4 flex-1">
            {/* Toggle Button */}
            <div className="w-6 flex items-center justify-center">
              {hasChildren && (
                <FiChevronDown
                  size={20}
                  onClick={() => toggleExpand(category.id)}
                  className={`cursor-pointer transition-transform text-orange-500 ${isExpanded ? "rotate-0" : "-rotate-90"}`}
                />
              )}
            </div>
            
            {/* 📸 Image & Info Section */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-sm flex-shrink-0">
                <Image 
                  src={category.coverImage || defaultImg} 
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>

              <div className="flex flex-col">
                <h3 className="font-semibold text-gray-800 text-sm">{category.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                    {category.slug}
                  </span>
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 ${
                    category.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {category.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1">
            <button 
              onClick={() => router.push(`/admin/blogs/categories/update/${category.id}`)}
              className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-100 rounded-lg transition-all"
              title="Edit"
            >
              <FiEdit2 size={16} />
            </button>
            <button 
              onClick={() => handleDeleteClick(category.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        {/* Child Rows */}
        {isExpanded && hasChildren && (
          <div className="flex flex-col w-full">
            {category.children?.map((child) => renderCategoryRow(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-4 animate-in fade-in duration-500">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <PageRouteHeader />
          <PageTitle
            title="Blog Categories"
            description="Manage your store's hierarchical taxonomy with ease."
          />
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown
            value={filter}
            options={FILTER_OPTIONS}
            onChange={setFilter}
          />
          <CreateButton
            label="Add New"
            onClick={() => router.push("/admin/blogs/categories/create")}
            className="bg-[#F97316] hover:bg-[#ea580c] shadow-md shadow-orange-100 py-4 text-white"
            icon={<MdOutlineCategory size={18} />}
          />
        </div>
      </div>

      {/* --- Search Bar --- */}
      <div className="relative group">
        <SearchInput
          value={search}
          placeholder="Search categories by name or slug..."
          onChange={setSearch}
        />
      </div>

      {/* --- Data Table --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {filteredData.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-32 text-gray-400">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <MdCategory size={48} className="text-gray-200" />
            </div>
            <p className="font-medium">No categories found matching your criteria</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Table Header */}
            <div className="hidden md:flex justify-between px-8 py-4 bg-gray-50/50 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100">
              <span className="flex-1 ml-10">Name & Hierarchy</span>
              <span className="w-24 text-right">Actions</span>
            </div>
            {/* Rows */}
            {filteredData.map((cat) => renderCategoryRow(cat))}
          </div>
        )}
      </div>

      {/* --- Delete Confirmation --- */}
      <ConfirmAlert
        open={alertOpen}
        title="Delete Category?"
        message="All sub-categories will also be affected. This action cannot be undone."
        confirmText={isPending ? "Deleting..." : "Yes, Delete It"}
        icon={<FiTrash2 size={40} className="text-red-500" />}
        onConfirm={confirmDelete}
        onCancel={() => setAlertOpen(false)}
      />
    </div>
  );
}