"use client";

import { useMemo, useState } from "react";
import { PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown, { FilterOption } from "@/components/common/FilterDropdown";
import { FiChevronDown, FiChevronRight, FiEdit2, FiImage, FiInbox } from "react-icons/fi";
import { useRouter } from "next/navigation";
import CreateButton from "@/components/common/CreateButton";
import ConfirmActionDialog from "@/components/admin/ConfirmActionDialogProps";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdAddComment } from "react-icons/md";
import { ServiceCategoryResponseDTO } from "@/modules/service-category/service-category.dto";
import { deleteServiceCategoryAction } from "@/app/actions/service-category.action";
import { getInteriorIconById } from "@/public/assets/constants-icons/interior-icons";

interface ServiceCategoryListProps {
  categories: ServiceCategoryResponseDTO[];
}

type StatusFilter = "all" | "active" | "inactive";

const FILTER_OPTIONS: FilterOption<StatusFilter>[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function ServiceCategoryList({ categories }: ServiceCategoryListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  /* =====================================================
      Search + Filter Logic
  ===================================================== */
  const matches = (c: ServiceCategoryResponseDTO) => {
    const s = c.name.toLowerCase().includes(search.toLowerCase()) || 
              c.slug.toLowerCase().includes(search.toLowerCase());
    const f = filter === "all" ? true : c.status === filter;
    return s && f;
  };

  /* =====================================================
      Tree Builder (Derived Data)
  ===================================================== */
  const filteredTree = useMemo(() => {
    // 1. Filter parents based on their own match or their children's match
    const parents = categories
      .filter((c) => c.parentId === null)
      .filter((parent) => {
        const hasMatchingChild = categories.some(
          (child) => child.parentId === parent.id && matches(child)
        );
        return matches(parent) || hasMatchingChild;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);

    // 2. Build map for children that match filters
    const childrenMap = categories.reduce<Record<string, ServiceCategoryResponseDTO[]>>((acc, cat) => {
      if (cat.parentId && matches(cat)) {
        acc[cat.parentId] = acc[cat.parentId] || [];
        acc[cat.parentId].push(cat);
      }
      return acc;
    }, {});

    return { parents, childrenMap };
  }, [categories, search, filter]);

  const handleDelete = async (id: string) => {
    try {
      await deleteServiceCategoryAction(id);
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const IconDisplay = ({ iconId }: { iconId?: string }) => {
    if (!iconId) return <FiImage className="text-gray-300" size={18} />;
    const IconComponent = getInteriorIconById(iconId);
    return <IconComponent size={18} className="text-orange-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="w-full flex flex-col md:flex-row items-center md:px-6 justify-between gap-4">
        <PageTitle 
            title="Service Categories" 
            description="Organize your services with hierarchy." 
        />
        <div className="flex gap-4 items-center">
          <SearchInput value={search} placeholder="Search..." onChange={setSearch} />
          <FilterDropdown value={filter} options={FILTER_OPTIONS} onChange={setFilter} />
          <CreateButton 
            label="Add" 
            icon={<MdAddComment size={20} />} 
            onClick={() => router.push("/admin/service/categories/create")} 
            className="text-white py-4"
          />
        </div>
      </div>

      <div className="grid gap-3">
        {filteredTree.parents.length > 0 ? (
          filteredTree.parents.map((parent) => {
            const children = filteredTree.childrenMap[parent.id] || [];
            const isOpen = expanded[parent.id];

            return (
              <div key={parent.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {/* Parent Row */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setExpanded(p => ({ ...p, [parent.id]: !p[parent.id] }))}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {children.length > 0 ? (isOpen ? <FiChevronDown /> : <FiChevronRight />) : <span className="w-4" />}
                    </button>
                    
                    <div className="w-10 h-10 bg-orange-50 rounded flex items-center justify-center border border-orange-100">
                      {parent.thumbnail ? (
                        <img src={parent.thumbnail} alt={parent.name} className="w-full h-full object-cover rounded" />
                      ) : (
                        <IconDisplay iconId={parent.icon} />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{parent.name}</span>
                        <span className={`h-2 w-2 rounded-full ${parent.status === 'active' ? 'bg-green-500' : 'bg-red-400'}`} />
                      </div>
                      <p className="text-xs text-gray-400 font-mono">{parent.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => router.push(`/admin/service/categories/${parent.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition">
                      <FiEdit2 size={18} />
                    </button>
                    <ConfirmActionDialog
                      title="Delete Category?"
                      description="This will permanently delete the category."
                      action={() => handleDelete(parent.id)}
                      trigger={
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition">
                          <RiDeleteBin6Line size={20} />
                        </button>
                      }
                    />
                  </div>
                </div>

                {/* Sub-categories (Children) */}
                {isOpen && children.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-100 divide-y divide-gray-100">
                    {children.map(child => (
                      <div key={child.id} className="flex items-center justify-between py-3 pl-20 pr-4 hover:bg-white transition-colors">
                        <div className="flex items-center gap-4">
                          <IconDisplay iconId={child.icon} />
                          <div>
                             <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">{child.name}</span>
                                <span className={`h-1.5 w-1.5 rounded-full ${child.status === 'active' ? 'bg-green-500' : 'bg-red-300'}`} />
                             </div>
                             <span className="text-[10px] text-gray-400 font-mono leading-none">{child.slug}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button onClick={() => router.push(`/admin/service/categories/${child.id}`)} className="p-1.5 text-gray-500 hover:text-blue-600">
                             <FiEdit2 size={14} />
                          </button>
                          <ConfirmActionDialog
                              title="Delete Sub-category?"
                              action={() => handleDelete(child.id)}
                              trigger={<button className="p-1.5 text-gray-400 hover:text-red-500"><RiDeleteBin6Line size={16} /></button>}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Empty State (Not Found) */
          <div className="text-center text-sm text-gray-300 border min-h-70 flex flex-col justify-center items-center border-dashed rounded-xl gap-2">
            <FiInbox size={40} className="text-gray-200" />
            <p>No categories found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}