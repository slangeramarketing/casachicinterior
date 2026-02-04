// app/admin/review/update/[id]/page.tsx

import { reviewServer } from "@/modules/review/review.server";
import ReviewForm from "@/components/admin/clientComponent/review/ReviewForm";

interface PageProps {
  params: { reviewId: string };
}

export default async function UpdateReviewPage({ params }: PageProps) {
  const { reviewId } = await params;
 
  const review = await reviewServer.findById(reviewId);
  console.log("Review by ID: ",review);


  // ✅ REQUIRED NULL GUARD
  if (!review) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold text-red-600">
          Review not found
        </h2>
        <p className="mt-2 text-gray-500">
          This review may have been deleted or does not exist.
        </p>
      </div>
    );
  }

  return (
    <ReviewForm
      mode="update"
      reviewData={{
        id: review.id,
        status: review.status,
        isFeatured: review.isFeatured,
        adminResponse: review.adminResponse,
        clientAvatar:review.clientAvatar,
        clientEmail:review.clientEmail,
        message:review.message
      }}
    />
  );
}
