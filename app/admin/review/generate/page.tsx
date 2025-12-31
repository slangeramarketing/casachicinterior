"use client";
import GenerateReviewLinkForm from "@/components/admin/GenerateReviewLinkForm";
import CreateButton from "@/components/common/CreateButton";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import { useRouter } from "next/navigation";

export default function Page() {
    const route = useRouter();

  return (
    <div className="px-8 py-2">
      {/* HEADER */}
      <div className="w-full flex flex-col">
       <PageRouteHeader />
       <PageTitle
            title="Review"
            description="This is for Review Section Page"
        />
      </div>
      {/* REVIEW LIST */}
      <div className="w-full flex flex-wrap gap-6 mt-6 justify-center">
       <GenerateReviewLinkForm
            projects={[
                { id: "p1", title: "Luxury Living Room Interior" },
                { id: "p2", title: "2BHK Full Home Interior" }
            ]}
            clients={[
                { id: "c1", name: "Amit Sharma", email: "amit.sharma@gmail.com" },
                { id: "c2", name: "Neha Verma", email: "neha.verma@gmail.com" }
            ]}
            />

      </div>
    </div>
  );
}
