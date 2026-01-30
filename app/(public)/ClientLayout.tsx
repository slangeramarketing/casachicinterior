
import Header from "@/components/public/layouts/Header";
import Footer from "@/components/public/layouts/Footer";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";


export default async  function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   
  const mainServiceCategoryList=await serviceCategoryServer.getByParent(null);

  return (
    <>
        <div>
         <Header mainServiceCategoryList={mainServiceCategoryList} />
        </div>
        <main>{children}</main>
       <div>
         <Footer mainServiceCategoryList={mainServiceCategoryList} />
       </div>
    </>
  );
}
