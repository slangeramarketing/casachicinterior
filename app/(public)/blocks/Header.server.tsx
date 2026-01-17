
import { serviceServer } from "@/modules/services/service.server";
import Header from "@/components/public/Header";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HeaderServer() {
  const featuredServiceList = await serviceServer.getFeatured(5);

  return <Header featuredServiceList={featuredServiceList} />;
}
