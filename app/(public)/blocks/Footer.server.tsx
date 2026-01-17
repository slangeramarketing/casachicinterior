
import { serviceServer } from "@/modules/services/service.server";
import Footer from "@/components/public/Footer";
export const dynamic = "force-dynamic";
export const revalidate = 0;


export default async function FooterServer() {
  const featuredServiceList = await serviceServer.getFeatured(5);

  return <Footer featuredServiceList={featuredServiceList} />;
}
