// components/public/CategorySlider.tsx
import Image from "next/image";

export default function CategorySlider({ categories, activeCategory, onCategoryChange }: any) {
  return (
    <div className="w-full">
      <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {/* All Button */}
        <div 
          onClick={() => onCategoryChange("All")}
          className="flex-shrink-0 cursor-pointer group text-center"
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all 
            ${activeCategory === "All" ? "border-orange-500 bg-orange-50" : "border-neutral-100 bg-neutral-50"}`}>
            <span className="text-xs font-bold uppercase tracking-tighter">All</span>
          </div>
          <p className={`text-[11px] mt-2 font-bold uppercase transition-colors 
            ${activeCategory === "All" ? "text-orange-600" : "text-neutral-400 group-hover:text-neutral-900"}`}>
            Everything
          </p>
        </div>

        {/* Categories from DB */}
        {categories.map((cat: any) => (
          <div 
            key={cat._id}
            onClick={() => onCategoryChange(cat.slug)}
            className="flex-shrink-0 cursor-pointer group text-center"
          >
            <div className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all
              ${activeCategory === cat.slug ? "border-orange-500 scale-105 shadow-lg shadow-orange-100" : "border-neutral-100 opacity-70 group-hover:opacity-100"}`}>
              <Image 
                src={cat.coverImage || "/placeholder-cat.jpg"} 
                alt={cat.name} 
                fill 
                className="object-cover"
              />
            </div>
            <p className={`text-[11px] mt-2 font-bold uppercase transition-colors 
              ${activeCategory === cat.slug ? "text-orange-600" : "text-neutral-400 group-hover:text-neutral-900"}`}>
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}