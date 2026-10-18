"use client";

/***************************************************
 * File: components/admin/clientComponent/seo/PageSeoList.tsx
 * Purpose:
 * - Overview of every managed public page with its SEO entry
 *   (or a "Set up" prompt when none exists), with search,
 *   status filter, edit, preview and confirmed delete.
 ***************************************************/

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown, { FilterOption } from "@/components/common/FilterDropdown";
import CreateButton from "@/components/common/CreateButton";
import ConfirmActionDialog from "@/components/admin/ConfirmActionDialogProps";
import Alert from "@/components/common/Alert";
import { FiEdit2, FiExternalLink, FiInbox, FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PageSeoResponseDTO } from "@/modules/seo/seo.dto";
import { PageSeoStatus } from "@/modules/seo/seo.types";
import { deletePageSeoAction } from "@/app/actions/seo.action";
import { MANAGED_PAGES } from "@/lib/seo/managedPages";
import { formatIst } from "@/lib/utils/formatIst";

interface PageSeoListProps {
  entries: PageSeoResponseDTO[];
  siteUrl: string;
}

type StatusFilter = "all" | PageSeoStatus | "missing";

const FILTER_OPTIONS: FilterOption<StatusFilter>[] = [
  { label: "All pages", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Disabled", value: "disabled" },
  { label: "Not set up", value: "missing" },
];

const STATUS_STYLE: Record<PageSeoStatus, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-amber-100 text-amber-700",
  disabled: "bg-gray-200 text-gray-600",
};

interface Row {
  route: string;
  label: string;
  entry: PageSeoResponseDTO | null;
}


export default function PageSeoList({ entries, siteUrl }: PageSeoListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [alert, setAlert] = useState<{ type: "success" | "error"; title: string; message?: string } | null>(null);

  const rows = useMemo<Row[]>(() => {
    const byRoute = new Map(entries.map((e) => [e.route, e]));
    const managed: Row[] = MANAGED_PAGES.map((p) => ({
      route: p.route,
      label: p.label,
      entry: byRoute.get(p.route) ?? null,
    }));
    // Entries for routes no longer in the registry are still shown so they can be cleaned up.
    const orphans: Row[] = entries
      .filter((e) => !MANAGED_PAGES.some((p) => p.route === e.route))
      .map((e) => ({ route: e.route, label: e.routeLabel, entry: e }));
    return [...managed, ...orphans];
  }, [entries]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const haystack = [
        row.route,
        row.label,
        row.entry?.title,
        row.entry?.primaryKeyword,
        ...(row.entry?.secondaryKeywords ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      const matchesFilter =
        filter === "all" ||
        (filter === "missing" ? row.entry === null : row.entry?.status === filter);
      return matchesSearch && matchesFilter;
    });
  }, [rows, search, filter]);

  const handleDelete = async (entry: PageSeoResponseDTO) => {
    const result = await deletePageSeoAction(entry.id, entry.route);
    if (!result.success) {
      setAlert({ type: "error", title: "Delete failed", message: result.error });
      return;
    }
    setAlert({ type: "success", title: "Deleted", message: `${entry.routeLabel} now uses its default metadata.` });
    router.refresh();
  };

  const publicUrl = (route: string) => `${siteUrl}${route === "/" ? "" : route}`;

  return (
    <div className="space-y-6">
      <div className="w-full flex flex-col md:flex-row items-center md:px-6 justify-between gap-4">
        <PageTitle
          title="Page SEO"
          description="Titles, descriptions and keywords for the website's main pages."
        />
        <div className="flex gap-4 items-center">
          <SearchInput value={search} placeholder="Search page, title, keyword..." onChange={setSearch} />
          <FilterDropdown value={filter} options={FILTER_OPTIONS} onChange={setFilter} />
          <CreateButton
            label="Add"
            icon={<FiPlus size={20} />}
            onClick={() => router.push("/admin/seo/create")}
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
            <p>No pages match your search.</p>
          </div>
        ) : (
          visible.map((row) => (
            <div
              key={row.route}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-800">{row.label}</span>
                  <span className="text-xs text-gray-400 font-mono">{row.route}</span>
                  {row.entry ? (
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_STYLE[row.entry.status]}`}>
                      {row.entry.status}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      not set up
                    </span>
                  )}
                  {row.entry && row.entry.metaRobots !== "index, follow" && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                      {row.entry.metaRobots}
                    </span>
                  )}
                </div>

                {row.entry ? (
                  <>
                    <p className="text-sm text-gray-700 mt-1 truncate">
                      {row.entry.title || <span className="text-gray-400 italic">No title yet</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {row.entry.description || <span className="italic">No description yet</span>}
                    </p>
                    {(row.entry.primaryKeyword || row.entry.secondaryKeywords.length > 0) && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {row.entry.primaryKeyword && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                            {row.entry.primaryKeyword}
                          </span>
                        )}
                        {row.entry.secondaryKeywords.slice(0, 6).map((k) => (
                          <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {k}
                          </span>
                        ))}
                        {row.entry.secondaryKeywords.length > 6 && (
                          <span className="text-[11px] text-gray-400">+{row.entry.secondaryKeywords.length - 6} more</span>
                        )}
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-2">
                      Updated {formatIst(row.entry.updatedAt)}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Using the page&apos;s built-in title and description.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={publicUrl(row.route)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open page"
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
                >
                  <FiExternalLink size={18} />
                </a>
                {row.entry ? (
                  <>
                    <button
                      onClick={() => router.push(`/admin/seo/${row.entry!.id}`)}
                      title="Edit"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <ConfirmActionDialog
                      title="Delete SEO entry?"
                      description={`${row.label} will go back to its built-in title and description. This cannot be undone.`}
                      confirmText="Delete"
                      danger
                      action={() => handleDelete(row.entry!)}
                      trigger={
                        <button title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-full transition">
                          <RiDeleteBin6Line size={20} />
                        </button>
                      }
                    />
                  </>
                ) : (
                  <button
                    onClick={() => router.push(`/admin/seo/create?route=${encodeURIComponent(row.route)}`)}
                    className="text-xs font-semibold px-3 py-2 rounded-md bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316]/20 transition"
                  >
                    Set up
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
