/***************************************************
 * File: components/public/seo/Breadcrumbs.tsx
 * Purpose:
 * - Visible breadcrumb trail for detail pages. The matching
 *   BreadcrumbList JSON-LD is emitted by the server page via
 *   breadcrumbJsonLd() so markup and schema always agree.
 * - Plain presentational component: usable from both server and
 *   client components.
 ***************************************************/

import Link from "next/link";

export interface BreadcrumbLink {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbLink[];
  /** "light" for dark hero backgrounds, "dark" for white backgrounds. */
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}

export default function Breadcrumbs({ items, tone = "dark", align = "left", className = "" }: BreadcrumbsProps) {
  if (!items.length) return null;

  const base = tone === "light" ? "text-white/80" : "text-gray-500";
  const link = tone === "light" ? "hover:text-white" : "hover:text-[#F97316]";
  const current = tone === "light" ? "text-white" : "text-gray-800";

  return (
    <nav aria-label="Breadcrumb" className={`text-xs md:text-sm ${base} ${className}`}>
      <ol className={`flex flex-wrap items-center gap-1.5 ${align === "center" ? "justify-center" : ""}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <span aria-hidden="true">/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className={`${link} transition-colors`}>
                  {item.name}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? `${current} font-medium` : ""}>
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
