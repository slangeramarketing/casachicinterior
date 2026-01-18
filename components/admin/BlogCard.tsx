"use client";

import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  thumbnail: string;
  category: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  href: string;
  featured?: boolean; // ✅ Added featured prop

  /* Author (optional) */
  showAuthor?: boolean;
  authorName?: string;
  authorAvatar?: string;

  /* styling hooks */
  wrapperClassName?: string;
  imageWrapperClassName?: string;
  imageClassName?: string;
  contentClassName?: string;
  categoryClassName?: string;
  titleClassName?: string;
  metaClassName?: string;
  descriptionClassName?: string;
  readMoreClassName?: string;
  featuredBadgeClassName?: string; // ✅ Optional styling hook for badge

  authorWrapperClassName?: string;
  authorImageClassName?: string;
  authorNameClassName?: string;
}

export default function BlogCard({
  thumbnail,
  category,
  title,
  description,
  createdAt,
  updatedAt,
  href,
  featured = false, // ✅ Default value

  showAuthor = false,
  authorName,
  authorAvatar,

  wrapperClassName = "",
  imageWrapperClassName = "relative overflow-hidden", // Added relative for badge positioning
  imageClassName = "",
  contentClassName = "",
  categoryClassName = "",
  titleClassName = "",
  metaClassName = "",
  descriptionClassName = "",
  readMoreClassName = "",
  featuredBadgeClassName = "", // ✅

  authorWrapperClassName = "",
  authorImageClassName = "",
  authorNameClassName = "",
}: BlogCardProps) {
  return (
    <div className={wrapperClassName}>
      {/* Thumbnail Section */}
      <div className={`relative ${imageWrapperClassName}`}>
        <Image
          src={thumbnail}
          alt={title}
          width={600}
          height={350}
          className={imageClassName}
        />

        {/* ✅ Featured Badge (Same as ServiceCard logic) */}
        {featured && (
          <span 
            className={`absolute left-3 top-3 rounded-full bg-bg-primary px-3 py-1 text-[8px] font-semibold text-white flex items-center uppercase tracking-wider shadow-sm z-10 ${featuredBadgeClassName}`}
          >
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className={contentClassName}>
        <p className={categoryClassName}>{category}</p>

        <h2 className={titleClassName}>{title}</h2>

        <p className={metaClassName}>
          Created: {createdAt} &nbsp;|&nbsp; Updated: {updatedAt}
        </p>

        <p className={descriptionClassName}>{description}</p>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
          {showAuthor && authorName && (
            <div className={`flex items-center gap-2 ${authorWrapperClassName}`}>
              {authorAvatar ? (
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  width={28}
                  height={28}
                  className={`rounded-full object-cover ${authorImageClassName}`}
                />
              ) : (
                <div
                  className={`w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold ${authorImageClassName}`}
                >
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}

              <span className={`text-xs text-gray-600 ${authorNameClassName}`}>
                {authorName}
              </span>
            </div>
          )}
          
          <Link href={href} className={readMoreClassName}>
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
}