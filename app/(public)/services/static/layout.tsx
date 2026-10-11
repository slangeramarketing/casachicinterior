import { Metadata } from "next";

/**
 * /services/static is a design preview that duplicates the real
 * /services page. Keep it reachable for the team but out of search.
 */
export const metadata: Metadata = {
  title: "Services Preview | Casa Chic Interior",
  robots: { index: false, follow: false },
};

export default function StaticServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
