/***************************************************
 * File: app/admin/reviews/page.tsx
 * Layer: Server Page
 *
 * Purpose:
 * - Fetch all reviews for admin dashboard
 *
 * Responsibilities:
 * - Call Review server facade for READ
 * - Pass data to client component
 *
 * Restrictions:
 * - Must NOT access repository
 * - Must NOT call service directly
 ***************************************************/

import ReviewList from "@/components/admin/clientComponent/review/ReviewList";
import { reviewServer } from "@/modules/review/review.server";

export default async function ReviewServerPage() {
  // Fetch ALL reviews (pending + approved + rejected)
  const reviews = await reviewServer.getAdminReviews();
  console.log("All Review Data feated: ",reviews);
  return (
    <div className="p-4 md:p-0">
      <ReviewList reviews={reviews} />
    </div>
  );
}
