/***************************************************
 * File: app/(public)/review/submission/[token]/page.tsx
 * Layer: Server Page
 ***************************************************/

import ReviewSubmitForm from "@/components/admin/clientComponent/review/ReviewSubmitForm";
import { reviewServer } from "@/modules/review/review.server";

export default async function ReviewSubmissionPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params; // ✅ REQUIRED in typed-routes

  try {
    const review = await reviewServer.validateReviewToken(token);

    if (review.submittedAt) {
      return (
        <div className="max-w-xl mx-auto mt-20 text-center py-32">
          <h2 className="text-2xl font-bold text-gray-800">
            Review already submitted
          </h2>
          <p className="mt-2 text-gray-500">
            Thank you! Your feedback has already been recorded.
          </p>
        </div>
      );
    }

    return (
      <div className="py-32 px-8">
        <ReviewSubmitForm
          token={token}
          clientName={review.clientName}
        />
      </div>
    );
  } catch {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center py-32">
        <h2 className="text-2xl font-bold text-red-600">
          Invalid or expired link
        </h2>
        <p className="mt-2 text-gray-500">
          This review link is no longer valid.
        </p>
      </div>
    );
  }
}
