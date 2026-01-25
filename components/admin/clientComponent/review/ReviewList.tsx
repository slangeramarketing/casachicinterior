"use client";

/***************************************************
 * File: components/admin/clientComponent/review/ReviewList.tsx
 * Layer: Client Component
 *
 * Purpose:
 * - Display and manage admin reviews list
 *
 * Responsibilities:
 * - Render review cards
 * - Handle local filtering & search
 * - Trigger server actions for updates
 *
 * Restrictions:
 * - Must NOT fetch data
 ***************************************************/

import Alert, { AlertType } from "@/components/common/Alert";
import FilterDropdown, { FilterOption } from "@/components/common/FilterDropdown";
import SearchInput from "@/components/common/SearchInput";
import { useState, useMemo } from "react";
import { FiRefreshCw } from "react-icons/fi";
import AdminReviewCard from "./AdminReviewCard";
import CreateButton from "@/components/common/CreateButton";
import { useRouter } from "next/navigation";
import { ReviewResponseDTO } from "@/modules/review/review.dto";
import { MdOutlineReviews } from "react-icons/md";
import { PageRouteHeader } from "@/components/common/PageHeader";

type StatusType = "all" | "pending" | "approved" | "rejected";

const filterOptions: FilterOption<StatusType>[] = [
  { label: "All Reviews", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

interface ReviewListProps {
  reviews: ReviewResponseDTO[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  /* ===============================================
     Filter + Search Logic
     =============================================== */

  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const matchesStatus =
        statusFilter === "all" || rev.status === statusFilter;

      const search = searchQuery.toLowerCase();

      const matchesSearch =
        rev.clientName.toLowerCase().includes(search) ||
        (rev.clientEmail?.toLowerCase().includes(search) ?? false) ||
        rev.id.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [reviews, statusFilter, searchQuery]);

  /* ===============================================
     UI Helpers
     =============================================== */

  const refreshData = () => {
    setLoading(true);
    router.refresh(); // ✅ server-side refresh
    // Server Page revalidation should be wired later
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <div className="space-y-6">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex-1 max-w-md">
            <PageRouteHeader/>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, email or ID..."
          />
        </div>

        <div className="flex items-center gap-3">
          <CreateButton
            label=""
            onClick={() => router.push("/admin/review/create")}
            icon={<MdOutlineReviews  size={20} />}
            className="bg-bg-primary py-4 text-white"
          />

          <FilterDropdown
            value={statusFilter}
            options={filterOptions}
            onChange={setStatusFilter}
          />

          <button
            onClick={refreshData}
            className="p-2 text-gray-400 hover:text-[#F97316] hover:bg-orange-50 rounded-md border transition-all"
          >
            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
              size={18}
            />
          </button>
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-50 border border-dashed rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <AdminReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium italic">
            No reviews found matching your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
