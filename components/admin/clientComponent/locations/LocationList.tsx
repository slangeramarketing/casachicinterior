"use client";

/***************************************************
 * File: components/admin/clientComponent/locations/LocationList.tsx
 * Purpose:
 * - Overview of location landing pages with search, status filter,
 *   open-on-site, edit and confirmed delete.
 ***************************************************/

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown, { FilterOption } from "@/components/common/FilterDropdown";
import CreateButton from "@/components/common/CreateButton";
import ConfirmActionDialog from "@/components/admin/ConfirmActionDialogProps";
import Alert from "@/components/common/Alert";
import { FiEdit2, FiExternalLink, FiInbox, FiMapPin, FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LocationResponseDTO } from "@/modules/locations/location.dto";
import { LocationStatus } from "@/modules/locations/location.types";
import { deleteLocationAction } from "@/app/actions/location.action";
import { formatIst } from "@/lib/utils/formatIst";

interface LocationListProps {
  locations: LocationResponseDTO[];
  siteUrl: string;
}

type StatusFilter = "all" | LocationStatus;

const FILTER_OPTIONS: FilterOption<StatusFilter>[] = [
  { label: "All pages", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Disabled", value: "disabled" },
];

const STATUS_STYLE: Record<LocationStatus, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-amber-100 text-amber-700",
  disabled: "bg-gray-200 text-gray-600",
};

export default function LocationList({ locations, siteUrl }: LocationListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [alert, setAlert] = useState<{ type: "success" | "error"; title: string; message?: string } | null>(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return locations.filter((loc) => {
      const haystack = [loc.areaName, loc.title, loc.slug, ...loc.localities, ...loc.keywords]
        .join(" ")
        .toLowerCase();
      return (!q || haystack.includes(q)) && (filter === "all" || loc.status === filter);
    });
  }, [locations, search, filter]);

  const handleDelete = async (loc: LocationResponseDTO) => {
    const result = await deleteLocationAction(loc.id, loc.slug);
    if (!result.success) {
      setAlert({ type: "error", title: "Delete failed", message: result.error });
      return;
    }
    setAlert({ type: "success", title: "Deleted", message: `/${loc.slug} has been removed.` });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="w-full flex flex-col md:flex-row items-center md:px-6 justify-between gap-4">
        <PageTitle
          title="Location Pages"
          description="One landing page per area you serve, each with its own local content."
        />
        <div className="flex gap-4 items-center">
          <SearchInput value={search} placeholder="Search area, heading, locality..." onChange={setSearch} />
          <FilterDropdown value={filter} options={FILTER_OPTIONS} onChange={setFilter} />
          <CreateButton
            label="Add"
            icon={<FiPlus size={20} />}
            onClick={() => router.push("/admin/locations/create")}
            className="text-white py-4"
          />
        </div>
      </div>

      {alert && (
        <div className="md:px-6">
          <Alert {...alert} onClose={() => setAlert(null)} />
        </div>
      )}

      <div className="grid gap-3">
        {visible.length === 0 ? (
          <div className="text-center text-sm text-gray-300 border min-h-70 flex flex-col justify-center items-center border-dashed rounded-xl gap-2">
            <FiInbox size={40} className="text-gray-200" />
            <p>{locations.length === 0 ? "No location pages yet. Add the first area you serve." : "No pages match your search."}</p>
          </div>
        ) : (
          visible.map((loc) => (
            <div
              key={loc.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <FiMapPin className="text-[#F97316]" />
                  <span className="font-semibold text-gray-800">{loc.areaName}</span>
                  <span className="text-xs text-gray-400 font-mono">/{loc.slug}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_STYLE[loc.status]}`}>
                    {loc.status}
                  </span>
                  {loc.metaRobots !== "index, follow" && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                      {loc.metaRobots}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1 truncate">{loc.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {loc.localities.length} localities · {loc.serviceIds.length} services · {loc.projects.length} projects · {loc.faqs.length} FAQs · {loc.testimonials.length} reviews
                </p>
                <p className="text-[10px] text-gray-400 mt-2">Updated {formatIst(loc.updatedAt)}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`${siteUrl}/${loc.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={loc.status === "published" ? "Open page" : "Open page (shows 404 until published)"}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
                >
                  <FiExternalLink size={18} />
                </a>
                <button
                  onClick={() => router.push(`/admin/locations/${loc.id}`)}
                  title="Edit"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                >
                  <FiEdit2 size={18} />
                </button>
                <ConfirmActionDialog
                  title="Delete location page?"
                  description={`/${loc.slug} will stop existing and return a 404. If Google has indexed it, prefer setting the status to Disabled instead. This cannot be undone.`}
                  confirmText="Delete"
                  danger
                  action={() => handleDelete(loc)}
                  trigger={
                    <button title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-full transition">
                      <RiDeleteBin6Line size={20} />
                    </button>
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
