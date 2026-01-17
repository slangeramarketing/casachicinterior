import db from "@/lib/db";
import { serviceServer } from "@/modules/services/service.server";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export default async function FooterServer() {
  await db();
  const featuredServiceList = await serviceServer.getFeatured(5);

  return <Footer featuredServiceList={featuredServiceList} />;
}
