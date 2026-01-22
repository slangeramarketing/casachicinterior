import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineCalendar, HiOutlineArrowRight } from 'react-icons/hi2';

// Props Interface based on your specific requirements
interface BlogCardProps {
  title: string;
  summary: string;
  thumbnail: string;
  updatedAt: string | Date;
  slug: string;
  categoryName?: string; // Optional: Category dikhana design ke liye achha rehta hai
}

const PublicBlogCard: React.FC<BlogCardProps> = ({
  title,
  summary,
  thumbnail,
  updatedAt,
  slug,
  categoryName = "Interior"
}) => {
  
  // Date format karne ke liye helper
  const formattedDate = new Date(updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group bg-white border border-neutral-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* --- Image Section --- */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Category Tag */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-800 rounded-sm">
            {categoryName}
          </span>
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Last Updated */}
        <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-3 font-medium">
          <HiOutlineCalendar className="text-sm" />
          <span>Updated {formattedDate}</span>
        </div>

        {/* Title */}
        <Link href={`/blogs/${slug}`}>
          <h3 className="text-xl font-semibold text-neutral-800 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3 mb-6">
          {summary}
        </p>

        {/* Read More Link (Push to bottom) */}
        <div className="mt-auto pt-4 border-t border-neutral-50">
          <Link 
            href={`/blogs/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-neutral-900 group-hover:gap-3 transition-all underline-offset-4 hover:underline"
          >
            READ ARTICLE
            <HiOutlineArrowRight className="text-amber-700" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicBlogCard;