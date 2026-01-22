"use client";

import { useMemo, useState } from "react";
import { PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown, {
  FilterOption,
} from "@/components/common/FilterDropdown";
import { ServiceCard } from "@/components/admin/clientComponent/service/ServiceCard";
import CreateButton from "@/components/common/CreateButton";
import { useRouter } from "next/navigation";
import { ServiceResponseDTO } from "@/modules/services/service.dto";
import { MdCategory } from "react-icons/md";
import { MdMedicalServices } from "react-icons/md";
import { deleteServiceAction } from "@/app/actions/service.action";



interface ServiceListProps {
  services: ServiceResponseDTO[];
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


   async function onDelete(id: string) {
    // noop
    await deleteServiceAction(id);
    // client-side refresh 
    router.refresh();
  }

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="space-y-6 lg:px-8">
      {/* Search + Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PageTitle
            title="Services"
            description="Manage and organize all services"
            titleClassName="!text-2xl"
          />
        </div>
        <div className="flex gap-4 justify-between md:justify-end">
          <SearchInput
            value={search}
            placeholder="Search services..."
            onChange={setSearch}
          />
          <div className="flex gap-2">
            <FilterDropdown
              value={filter}
              options={FILTER_OPTIONS}
              onChange={setFilter}
            />
            <CreateButton
              label=""
              icon={<MdCategory size={20} />}
              onClick={() =>
                router.push("/admin/service/categories")
              }
              className="py-4 text-white"
            />
            <CreateButton
              label=""
              icon={<MdMedicalServices size={20} />}
              onClick={() => router.push("/admin/service/create")}
              className="py-4 text-white"

            />

          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Empty */}
      {filteredServices.length === 0 && (
        <p className="text-center text-sm text-gray-300 border min-h-70 flex justify-center items-center border-dashed">
          No services found.
        </p>
      )}
    </div>
  );
}
