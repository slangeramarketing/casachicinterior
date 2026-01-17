"use client";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { useEffect, useState } from "react";
import { getFeaturedServicesAction } from "./actions/public.service.action";
import { ServiceResponseDTO } from "@/modules/services/service.dto";


export default  function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

const [featuredServiceList, setFeaturedServiceList]=useState<ServiceResponseDTO[]>([]);

  /* ===============================
     Fetched Featured Services
     ================================== */
  useEffect(()=>{
    async function loadService(){
      try{
        const services=await getFeaturedServicesAction();
        setFeaturedServiceList(services);
      }catch(err){
        console.error("Error fetching featured services:", err);
      }
    }

    loadService();
  },[]);

  return (
    <>
        <div>
         <Header featuredServiceList={featuredServiceList} />
        </div>
        <main>{children}</main>
       <div>
         <Footer featuredServiceList={featuredServiceList} />
       </div>
    </>
  );
}
