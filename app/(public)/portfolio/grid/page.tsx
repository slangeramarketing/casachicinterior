import type { Metadata } from "next";
import FilterableProjectsGrid from "@/components/public/portfolio/FilterableProjectsGrid";

export const metadata: Metadata = {
  title: "Projects Gallery | CasaChic Interior Design",
  description:
    "Browse CasaChic's full portfolio of interior design and architectural projects. Filter by Residential, Commercial, Kitchen, Bedroom, and Renovation.",
};

export default function PortfolioGridPage() {
  return (
    <main className="bg-[#050505]">
      <FilterableProjectsGrid />
    </main>
  );
}
