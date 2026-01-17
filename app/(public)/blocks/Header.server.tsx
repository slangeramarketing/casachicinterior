import db from "@/lib/db";
import { serviceServer } from "@/modules/services/service.server";
import Header from "@/components/public/Header";

export default async function HeaderServer() {
  await db();
  const featuredServiceList = await serviceServer.getFeatured(5);

  return <Header featuredServiceList={featuredServiceList} />;
}
