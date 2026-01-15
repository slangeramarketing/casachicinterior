"use client";

import { useMemo, useState } from "react";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown, {
  FilterOption,
} from "@/components/common/FilterDropdown";
import { ServiceCard } from "@/components/clientPage/services/ServiceCard";
import CreateButton from "@/components/common/CreateButton";
import { useRouter } from "next/navigation";
import { LiaStackExchange } from "react-icons/lia";

/* =====================================================
   Types (UI only)
===================================================== */
export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  featured?: boolean;
  createdAt: string;
}

interface ServiceListProps {
  services: ServiceItem[];

  /** context control */
  isAdmin?: boolean;

  /** admin only */
  onDelete?: (id: string) => Promise<void>;
}

/* =====================================================
   Filters
===================================================== */
type ServiceFilter = "all" | "featured";

const FILTER_OPTIONS: FilterOption<ServiceFilter>[] = [
  { label: "All", value: "all" },
  { label: "Featured", value: "featured" },
];

/* =====================================================
   Component
===================================================== */
export default function ServiceList({
  services,
  isAdmin = false,
  onDelete,
}: ServiceListProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ServiceFilter>("all");

  /* =====================================================
     Filter + Search (UI only)
  ===================================================== */
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        service.shortDescription
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ? true : service.featured === true;

      return matchesSearch && matchesFilter;
    });
  }, [services, search, filter]);

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="space-y-6 lg:px-8">
      {/* Header */}
      {isAdmin && (
       <div>
      <PageRouteHeader />
      <PageTitle
        title="Services"
        description={
          isAdmin
            ? "Manage and organize all services"
            : "Explore our professional services"
        }
      />
       </div>)}
      
      

      {/* Search + Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full flex gap-4 justify-end">
          <SearchInput
            value={search}
            placeholder="Search services..."
            onChange={setSearch}
          />

          <FilterDropdown
            value={filter}
            options={FILTER_OPTIONS}
            onChange={setFilter}
          />

          {/* ADMIN ACTIONS ONLY */}
          {isAdmin && (
            <>
              <CreateButton
                label="Category"
                onClick={() =>
                  router.push("/admin/service/categories/create")
                }
                className="py-4 text-white"
              />

              <CreateButton
                label="New"
                onClick={() => router.push("/admin/service/create")}
                className="py-4 text-white"
              />

              <CreateButton
                label="All-Categories"
                icon={<LiaStackExchange />}
                onClick={() =>
                  router.push("/admin/service/categories")
                }
                className="py-4 text-white"
              />
            </>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isAdmin={isAdmin}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Empty */}
      {filteredServices.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No services found.
        </p>
      )}
    </div>
  );
}
