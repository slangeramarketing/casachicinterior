"use client";

import CreateButton from "@/components/common/CreateButton";
import FilterDropdown from "@/components/common/FilterDropdown";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import { useMemo, useState } from "react";

import reviews from "@/lib/data/reviews/reviews.json";
import ReviewCard, { Review } from "@/components/common/ReviewCard";
import { useRouter } from "next/navigation";

export default function Page() {
  const [filter, setFilter] = useState<"az" | "za" | "new" | "old">("new");
  const [search, setSearch] = useState("");
  const route = useRouter();

  /* =========================
     FILTER + SEARCH LOGIC
  ========================= */
  const filteredReviews = useMemo(() => {
    let data: Review[] = [...reviews];

    // SEARCH (client name / project)
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.clientName.toLowerCase().includes(q) ||
          r.projectCategory.toLowerCase().includes(q)
      );
    }

    // SORT
    switch (filter) {
      case "az":
        data.sort((a, b) => a.clientName.localeCompare(b.clientName));
        break;

      case "za":
        data.sort((a, b) => b.clientName.localeCompare(a.clientName));
        break;

      case "old":
        data.sort(
          (a, b) =>
            new Date(a.reviewedAt).getTime() -
            new Date(b.reviewedAt).getTime()
        );
        break;

      case "new":
      default:
        data.sort(
          (a, b) =>
            new Date(b.reviewedAt).getTime() -
            new Date(a.reviewedAt).getTime()
        );
    }

    return data;
  }, [search, filter]);

  return (
    <div className="px-8 py-2">
      {/* HEADER */}
      <div className="w-full flex justify-between">
        <PageRouteHeader />

        <div className="flex gap-2">
          <SearchInput value={search} onChange={setSearch} />

          <FilterDropdown
            value={filter}
            onChange={setFilter}
            options={[
              { label: "A to Z", value: "az" },
              { label: "Z to A", value: "za" },
              { label: "New", value: "new" },
              { label: "Old", value: "old" }
            ]}
          />

          <CreateButton
            label="Create"
            className="text-white py-4"
            onClick={()=>route.replace('/admin/review/generate')} 
          />
        </div>
      </div>

      <PageTitle
        title="Review"
        description="This is for Review Section Page"
      />

      {/* REVIEW LIST */}
      <div className="w-full flex flex-wrap gap-6 mt-6 justify-center">
        {filteredReviews.length === 0 ? (
          <p className="text-gray-500">No reviews found</p>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}
