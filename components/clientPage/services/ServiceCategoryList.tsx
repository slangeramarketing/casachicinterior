"use client";

import { useMemo, useState } from "react";
import {
  PageRouteHeader,
  PageTitle,
} from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown, {
  FilterOption,
} from "@/components/common/FilterDropdown";
import {
  FiChevronDown,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import CreateButton from "@/components/common/CreateButton";

/* =====================================================
   Types (UI only)
===================================================== */
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  status: "active" | "inactive";
  displayOrder: number;
}

interface ServiceCategoryListProps {
  categories: CategoryItem[];
  onDelete: (id: string) => Promise<void>;
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
export default function ServiceCategoryList({
  categories,
  onDelete,
}: ServiceCategoryListProps) {
 
  const router=useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<
    Record<string, boolean>
  >({});

  /* =====================================================
     Build Tree
  ===================================================== */
  const tree = useMemo(() => {
    const parents = categories
      .filter((c) => c.parentId === null)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const childrenMap = categories.reduce<
      Record<string, CategoryItem[]>
    >((acc, cat) => {
      if (cat.parentId) {
        acc[cat.parentId] = acc[cat.parentId] || [];
        acc[cat.parentId].push(cat);
      }
      return acc;
    }, {});

    Object.values(childrenMap).forEach((arr) =>
      arr.sort((a, b) => a.displayOrder - b.displayOrder)
    );

    return { parents, childrenMap };
  }, [categories]);

  console.log("Categories: ",tree);

  /* =====================================================
     Search + Filter
  ===================================================== */
  const matches = (c: CategoryItem) => {
    const s =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase());

    const f =
      filter === "all" ? true : c.status === filter;

    return s && f;
  };




  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="space-y-6">
      <PageRouteHeader />
      <PageTitle
        title="Service Categories"
        description="Manage categories and sub-categories"
      />

      {/* Search + Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full flex gap-4">
          <SearchInput
            value={search}
            placeholder="Search categories..."
            onChange={setSearch}
          />
        
         <FilterDropdown
          value={filter}
          options={FILTER_OPTIONS}
          onChange={setFilter}
        />
        <CreateButton label="Category" onClick={()=>router.push("/admin/service/categories/create")} className="py-4 text-white cursor-pointer" />
        </div>


      </div>

      {/* Tree */}
      <div className="bg-white flex flex-col gap-4 pb-4">
        {tree ? tree.parents.map((parent) => {
          const children =
            tree.childrenMap[parent.id] || [];
          const isOpen = expanded[parent.id];

          if (!matches(parent) && !children.some(matches)) {
            return null;
          }

          return (
            <div
              key={parent.id}
              className="border border-gray-300"
            >
              {/* Parent */}
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={() =>
                    setExpanded((p) => ({
                      ...p,
                      [parent.id]: !p[parent.id],
                    }))
                  }
                  className="flex items-center gap-2"
                >
                  {children.length > 0 ? (
                    isOpen ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )
                  ) : (
                    <span className="w-4" />
                  )}
                  <span className="font-medium">
                    {parent.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({parent.slug})
                  </span>
                  <span className={parent.status==='active'? "text-xs bg-green-500 h-2 w-2 rounded-full":"bg-red-500 h-2 w-2 rounded-full"}>
                  </span>
                </button>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/service/categories/${parent.id}`)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(parent.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Children */}
              {isOpen && children.length > 0 && (
                <div className="bg-gray-50">
                  {children.map(
                    (child) =>
                      matches(child) && (
                        <div
                          key={child.id}
                          className="flex items-center justify-between px-10 py-2 text-sm hover:bg-white"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                            <span>{child.name}</span>
                            <span className="text-xs text-gray-400">
                              ({child.slug})
                            </span>
                            <span className={child.status==='active'? "text-xs bg-green-500 h-2 w-2 rounded-full":"bg-red-500 h-2 w-2 rounded-full"}>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/admin/service/categories/${child.id}`)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <FiEdit2 size={13} />
                            </button>
                            <button
                              onClick={() => onDelete(child.id)}
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
        }):<div>Data Not Found</div>}
      </div>
    </div>
  );
}
