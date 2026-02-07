import { serviceCategoryServer } from "@/modules/service-category/service-category.server";
import Link from "next/link";

export const metadata = {
  title: "Sitemap | Casa Chic Interior",
  description:
    "Explore all pages of Casa Chic Interior including services, design ideas, blogs, and policies.",
};

export default async function SitemapPage() {
    const mainServiceCategoryList=await serviceCategoryServer.getByParent(null);
    // Ab ye perfectly kaam karega!
    const topServiceSubCatList = await serviceCategoryServer.getTopFiveSubCategories();
  return (
    <section className="w-full py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Sitemap
          </h1>
          <p className="mt-3 text-gray-600 text-sm md:text-base">
            Browse all pages of Casa Chic Interior in one place.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* MAIN PAGES */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Main Pages
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/" className="text-blue-600 hover:text-orange-500">Home</Link></li>
              <li><Link href="/about" className="text-blue-600 hover:text-orange-500">About Us</Link></li>
              <li><Link href="/contact" className="text-blue-600 hover:text-orange-500">Contact Us</Link></li>
            </ul>
          </div>

          {/* DESIGN SOLUTIONS */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Design Solutions
            </h2>
            <ul className="space-y-2 text-gray-700">
              {mainServiceCategoryList?.map((cat) => (
              <li key={cat.id}><Link href={`/services/${cat.slug}`} className="text-blue-600 hover:text-orange-500">{cat.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* DESIGN IDEAS */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Design Ideas
            </h2>
            <ul className="space-y-2 text-gray-700">
              {topServiceSubCatList?.map((subCat) => (
              <li key={subCat.id}><Link href={`/services/${subCat.slug}`}className="text-blue-600 hover:text-orange-500">{subCat.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* OTHER */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Other Pages
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/blogs" className="text-blue-600 hover:text-orange-500">Blogs</Link></li>
              <li><Link href="/privacy-policy" className="text-blue-600 hover:text-orange-500">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-blue-600 hover:text-orange-500">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
