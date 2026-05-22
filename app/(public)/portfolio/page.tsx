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

export default function PortfolioPage() {
  return (
    <main className="relative bg-[#050505] min-h-screen">
      <PortfolioCinematic />
    </main>
  );
}
