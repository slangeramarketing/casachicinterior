"use client";

import Alert, { AlertType } from "@/components/common/Alert";
import FilterDropdown, { FilterOption } from "@/components/common/FilterDropdown";
import SearchInput from "@/components/common/SearchInput";
import { useState, useEffect, useMemo } from "react";
import { FiRefreshCw } from "react-icons/fi";
import AdminReviewCard from "./AdminReviewCard";
import CreateButton from "@/components/common/CreateButton";
import { useRouter } from "next/navigation";
import { GoCodeReview } from "react-icons/go";

// --- DUMMY DATA ---
const DUMMY_REVIEWS = [
  {
    id: "1",
    name: "Aman Shrivastav",
    email: "aman@example.com",
    location: "Indirapuram, Ghaziabad",
    avatar: "https://i.pravatar.cc/150?u=aman",
    rating: 5,
    message: "The modular kitchen design is fantastic! Space management ekdum top-notch.",
    status: "approved",
    serviceName: "Modular Kitchen",
    date: "20 Jan 2026",
    reviewToken: "tok_789abc"
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    location: "Sector 62, Noida",
    avatar: "https://i.pravatar.cc/150?u=priya",
    rating: 4,
    message: "Living room makeover was great. Professional team.",
    status: "pending",
    serviceName: "Full Home Renovation",
    date: "21 Jan 2026",
    reviewToken: "tok_123xyz"
  },
  {
    id: "3",
    name: "Vikram Singh",
    email: "vikram@example.com",
    location: "DLF Phase 3, Gurgaon",
    avatar: "https://i.pravatar.cc/150?u=vikram",
    rating: 3,
    message: "Design was okay, but finishing in wardrobes could be better.",
    status: "rejected",
    serviceName: "Wardrobe Design",
    date: "18 Jan 2026",
    reviewToken: "tok_456mno"
  },
];

type StatusType = "all" | "pending" | "approved" | "rejected";

const filterOptions: FilterOption<StatusType>[] = [
  { label: "All Reviews", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function ReviewList() {
  const [reviews, setReviews] = useState<any[]>(DUMMY_REVIEWS);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertType| null>(null);
  const router=useRouter()
  
  // States for Filtering & Searching
  const [statusFilter, setStatusFilter] = useState<StatusType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Logic: Search aur Filter dono ko handle karna
  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const matchesStatus = statusFilter === "all" || rev.status === statusFilter;
      const matchesSearch = 
        rev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rev.reviewToken && rev.reviewToken.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesStatus && matchesSearch;
    });
  }, [reviews, statusFilter, searchQuery]);

  const handleStatusUpdate = (id: string, status: "approved" | "rejected") => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setAlert({
      type: "success",
      title: "Action Successful",
      message: `Review has been marked as ${status}.`,
    });
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
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

      {/* TOOLBAR: Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder="Search by name, email or token..."
          />
        </div>

        <div className="flex items-center gap-3">
          <CreateButton
             label=""
             onClick={()=>router.push(`/admin/review/create`)}
             icon={<GoCodeReview size={20} />}
             className="bg-bg-primary py-4 text-white"
          
          />
          <FilterDropdown
            value={statusFilter}
            options={filterOptions}
            onChange={(val) => setStatusFilter(val)}
          />
          
          <button 
            onClick={refreshData} 
            className="p-2 text-gray-400 hover:text-[#F97316] hover:bg-orange-50 rounded-md border transition-all"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} />
          </button>
        </div>
      </div>

      {/* GRID LIST */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-50 border border-dashed rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((rev) => (
                <AdminReviewCard
                  key={rev.id}
                  review={rev}
                  onStatusChange={handleStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium italic">No reviews found matching your search or filter.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}