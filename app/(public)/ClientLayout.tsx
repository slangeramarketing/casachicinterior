
import Header from "@/components/public/layouts/Header";
import Footer from "@/components/public/layouts/Footer";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";
import { locationServer } from "@/modules/locations/location.server";
import { serviceServer } from "@/modules/services/service.server";


export default async  function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   
  const mainServiceCategoryList=await serviceCategoryServer.getByParent(null);
  // Ab ye perfectly kaam karega!
  const topServiceSubCatList = await serviceCategoryServer.getTopFiveSubCategories();
  // Never throws: returns [] when the database is unavailable.
  const locations = await locationServer.getPublishedLinks();
  // Footer links to the service detail pages (the pages that should rank).
  const services = await serviceServer
    .getPublic()
    .then((list) => list.map((s) => ({ id: s.id, title: s.title, slug: s.slug })))
    .catch(() => []);


  return (
    <>
        <div>
         <Header mainServiceCategoryList={mainServiceCategoryList} />
        </div>
        <main>{children}</main>

       <div>
         <Footer
           mainServiceCategoryList={mainServiceCategoryList}
           topServiceSubCatList={topServiceSubCatList}
           services={services}
           locations={locations}
         />
       </div>
    </>
  );
}
