"use client";

import { useRouter, usePathname } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";

/* =====================================================
   1️⃣ Back + Route Header
===================================================== */

interface PageRouteHeaderProps {
  showBack?: boolean;
  fallbackHref?: string; // 👈 ADD THIS
}



export function PageRouteHeader({
  showBack = true,
  fallbackHref = "/", // 👈 default fallback
}: PageRouteHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const routeLabel =
    pathname
      .split("/")
      .filter(Boolean)
      .slice(-2)
      .join(" / ")
      .toUpperCase();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      {showBack && (
        <button
          onClick={handleBack}
          className="p-1 rounded hover:bg-gray-100"
          aria-label="Go Back"
        >
          <IoIosArrowRoundBack
            size={24}
            className="text-gray-500 cursor-pointer"
          />
        </button>
      )}

      <p className="text-gray-400 text-xs tracking-[2px] md:block hidden">
        {routeLabel}
      </p>
    </div>
  );
}

/* =====================================================
   2️⃣ Page Title + Description
===================================================== */

interface PageTitleProps {
  title: string;
  description?: string;
  titleClassName?:string
  descriptionClassName?:string
  
}

export function PageTitle({ title, description , titleClassName="" , descriptionClassName="" }: PageTitleProps) {
  return (
    <div className="w-full pb-8">
      <h1 className={`text-xl font-semibold text-black ${titleClassName}`}>
        {title}
      </h1>
      {description && (
        <p className={`text-sm text-gray-500 ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
}
