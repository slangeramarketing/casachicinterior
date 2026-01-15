"use client";

/************** How to Use **************
   <ServiceCard
        id={service.id}
        slug={service.slug}
        title={service.title}
        shortDescription={service.shortDescription}
        coverImage={service.coverImage}
        featured={service.featured}
        createdAt={service.createdAt}
    />

    ---------------------------------------------

    <ServiceCard
        id={service.id}
        slug={service.slug}
        title={service.title}
        shortDescription={service.shortDescription}
        coverImage={service.coverImage}
        featured={service.featured}
        createdAt={service.createdAt}
        isAdmin
        onEdit={(id) => router.push(`/admin/services/update/${id}`)}
        onDelete={(id) => handleDelete(id)}
     />

 */

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { SlCalender } from "react-icons/sl";

/* =====================================================
   Types
===================================================== */
interface ServiceCardProps {
  service: {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    coverImage: string;
    featured?: boolean;
    createdAt?: string;
  };

  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

/* =====================================================
   Component
===================================================== */
export function ServiceCard({
 service,
  isAdmin = false,
  onDelete,
}: ServiceCardProps) {
  const {
    id,
    slug,
    title,
    shortDescription,
    coverImage,
    featured,
    createdAt,
  } = service;

  const detailLink = isAdmin
    ? `/admin/service/view/${id}`
    : `/services/${slug}`;

  const router = useRouter();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white transition hover:shadow-md">
      {/* ================= Image Section ================= */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover transition group-hover:scale-105"
        />

        {/* Featured Badge */}
        {featured && (
          <span className="absolute left-3 top-3 rounded-full bg-bg-primary px-3 py-1 text-xs text-white">
            Featured
          </span>
        )}
      </div>

      {/* ================= Content ================= */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-1 text-base font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {shortDescription}
        </p>

        {/* ================= Footer ================= */}
        <div className="mt-auto flex items-center justify-between gap-3">
          {/* Left side */}
          <div className="flex flex-col text-xs text-gray-400">
            {isAdmin && createdAt && (
              createdAt && (
              <span className="flex gap-2">
                <SlCalender/>
                {new Date(createdAt).toLocaleDateString()}
              </span>
            )
            )}

            <Link
              href={detailLink}
              className="block mt-2 text-sm font-medium text-orange-500 hover:underline"
            >
              View details →
            </Link>
          </div>

          {/* Right side (Admin Actions) */}
          {isAdmin && (
            <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/admin/service/${id}`)}
                  className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-black"
                  aria-label="Edit Service"
                >
                  <FiEdit2 size={16} />
                </button>

              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="rounded-md p-2 text-red-500 hover:bg-red-50"
                  aria-label="Delete Service"
                >
                  <FiTrash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
