/**
 * File: app/(public)/portfolio/page.tsx
 * Layer: Page (Server Component)
 *
 * Purpose:
 * - Serves as the Entry point for the Portfolio Route.
 * - Retains SEO metadata for optimization.
 * - Renders the Client Component PortfolioCinematic for scroll-based luxury entrance experience.
 */

import type { Metadata } from "next";
import PortfolioCinematic from "./PortfolioCinematic";
import { reviewServer } from '@/modules/review/review.server';

export const metadata: Metadata = {
  title: "Portfolio | CasaChic Interior Design — Delhi NCR",
  description:
    "Explore CasaChic's luxury architectural design portfolio. Experience our interactive walkthrough of modern, high-end homes and premium renovations.",
  keywords: [
    "interior design portfolio",
    "home renovation Delhi NCR",
    "luxury villa design",
    "premium architecture",
    "modern home interior"
  ],
};

export default async function PortfolioPage() {
  const reviewData = await reviewServer.getPublicFeaturedReviews();

  return (
    <main className="relative bg-[#050505] min-h-screen">
      <PortfolioCinematic reviews={reviewData} />
    </main>
  );
}
