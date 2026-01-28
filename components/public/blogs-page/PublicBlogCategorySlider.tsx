// components/public/CategorySlider.tsx
import { OptimizedImage } from "@/components/common/OptimizedImage";

interface Category {
  _id: string;
  name: string;
  slug: string;
  coverImage?: string;
}

interface Props {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export default function PublicBlogCategorySlider({ categories, activeCategory, onCategoryChange }: Props) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-neutral-800 mb-6">Explore Categories</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {/* "All" Category */}
        <button
          onClick={() => onCategoryChange("All")}
          className={`flex-shrink-0 flex flex-col items-center gap-3 transition-all ${
            activeCategory === "All" ? "opacity-100" : "opacity-60 hover:opacity-100"
          }`}
        >
          <div className={`w-20 h-20 rounded-full border-2 p-1 ${activeCategory === "All" ? "border-orange-500" : "border-transparent"}`}>
            <div className="w-full h-full rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold italic">ALL</div>
          </div>
          <span className="text-sm font-medium">All Posts</span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onCategoryChange(cat.slug)}
            className={`flex-shrink-0 flex flex-col items-center gap-3 transition-all ${
              activeCategory === cat.slug ? "opacity-100" : "opacity-60 hover:opacity-100"
            }`}
          >
            <div className={`w-20 h-20 rounded-full border-2 p-1 transition-all ${
              activeCategory === cat.slug ? "border-orange-500 scale-110" : "border-transparent"
            }`}>
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <OptimizedImage 
                  src={cat.coverImage || "/placeholder-cat.jpg"} 
                  alt={cat.name} 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}