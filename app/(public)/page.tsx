

import LandingPage from "@/components/public/LandingPage"
import { serviceServer } from "@/modules/services/service.server";

export default async  function page() {

  const featuredServiceList=await serviceServer.getFeatured(5);
  return (
    <>
     <LandingPage featuredServiceList={featuredServiceList} />
    </>
  )
}
