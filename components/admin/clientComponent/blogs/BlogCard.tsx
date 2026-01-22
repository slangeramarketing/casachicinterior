"use client";

import Image from "next/image";
import Link from "next/link";
import { BsTrash2 } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";

interface BlogCardProps {
  thumbnail: string;
  category: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  href: string;
  featured?: boolean;

  /* Admin Actions (Optional) */
  showActions?: boolean; // ✅ Action icons dikhane ke liye
  onEdit?: () => void;   // ✅ Edit click handler
  onDelete?: () => void; // ✅ Delete click handler

  /* Author (optional) */
  showAuthor?: boolean;
  authorName?: string;
  authorAvatar?: string;

  /* Styling Hooks */
  wrapperClassName?: string;
  imageWrapperClassName?: string;
  imageClassName?: string;
  contentClassName?: string;
  categoryClassName?: string;
  titleClassName?: string;
  metaClassName?: string;
  descriptionClassName?: string;
  readMoreClassName?: string;
  featuredBadgeClassName?: string;
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
  featured = false,

  showActions = false, // ✅ Default false
  onEdit,
  onDelete,

  showAuthor = false,
  authorName,
  authorAvatar,

  wrapperClassName = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden",
  imageWrapperClassName = "relative overflow-hidden",
  imageClassName = "w-full h-48 object-cover",
  contentClassName = "p-4",
  categoryClassName = "text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1",
  titleClassName = "text-lg font-bold text-gray-800 line-clamp-2 mb-2",
  metaClassName = "text-[10px] text-gray-400 mb-3",
  descriptionClassName = "text-sm text-gray-600 line-clamp-3 mb-4",
  featuredBadgeClassName = "",
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

        {featured && (
          <span className={`absolute left-3 top-3 rounded-full bg-orange-600 px-3 py-1 text-[8px] font-semibold text-white flex items-center uppercase tracking-wider shadow-sm z-10 ${featuredBadgeClassName}`}>
            Featured
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className={contentClassName}>
        <p className={categoryClassName}>{category}</p>
        <h2 className={titleClassName}>{title}</h2>
        <p className={metaClassName}>
          Created: {createdAt} &nbsp;|&nbsp; Updated: {updatedAt}
        </p>
        <p className={descriptionClassName}>{description}</p>
        <div>
          <Link href={href} className="text-orange-600 text-xs font-bold hover:underline">
                Read more →
          </Link>
        </div>

        {/* Footer Area */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
          
          {/* Left Side: Author or Empty */}
          <div className="flex items-center gap-2">
            {showAuthor && authorName && (
              <div className={`flex items-center gap-2 ${authorWrapperClassName}`}>
                {authorAvatar && authorAvatar.trim() !== "" ? (
                  <Image src={authorAvatar} alt={authorName} width={24} height={24} className={`rounded-full object-cover ${authorImageClassName}`} />
                ) : (
                  <div className={`w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 ${authorImageClassName}`}>
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className={`text-[11px] font-medium text-gray-700 ${authorNameClassName}`}>{authorName}</span>
              </div>
            )}
          </div>

          {/* Right Side: Actions (Admin) or Read More (Public) */}
          <div className="flex items-center gap-3">
            {showActions ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.preventDefault(); onEdit?.(); }}
                  className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
                  title="Edit Blog"
                >
                  <FiEdit2 size={16} />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); onDelete?.(); }}
                  className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                  title="Delete Blog"
                >
                  <BsTrash2 size={16} />
                </button>
              </div>
            ) : (
              ""
            )}

              
          </div>
          
        </div>
      </div>
    </div>
  );
}