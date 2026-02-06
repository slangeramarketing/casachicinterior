"use client"
import ContactSection from '@/components/public/landing-page/ContactSection'
import DesignProcessSection from '@/components/public/landing-page/DesignProcessSection'
import EnquiryModal from '@/components/public/EnquiryModal'
import EnquiryStickyTab from '@/components/public/EnquiryStickyTab'
import FAQSection from '@/components/public/landing-page/FAQSection'
import { ServiceResponseDTO } from '@/modules/services/service.dto'
import { useEffect, useState } from 'react'
import ContactFAB from '@/components/public/ContactFAB'
import HeroSection from '@/components/public/landing-page/HeroSection'
import ThirdPartyReviews from '@/components/public/landing-page/ThirdPartyReviews'
import ShortAboutSection from '@/components/public/service-page/ShortAboutSection'
import FeaturedProjectsSection from '@/components/public/landing-page/FeaturedProjectsSection'
import DesignSolutionsSection from '@/components/public/landing-page/DesignSolutionsSection'
import WhyChooseUsSection from '@/components/public/landing-page/WhyChooseUsSection'
import ReviewSection from '@/components/public/landing-page/ReviewSection'
import { ReviewResponseDTO } from '@/modules/review/review.dto'
import { getFeaturedServicesAction } from '@/app/(public)/actions/public.service.action'
import StatsSection from './StatsSection'

interface Props{
    reviews:ReviewResponseDTO[];
}
export default function LandingPage({reviews}:Props) {
  
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
    <div>
     <HeroSection/>
     <ThirdPartyReviews/>
     <ShortAboutSection/>
     <FeaturedProjectsSection/>
     <DesignSolutionsSection featuredServiceList={featuredServiceList} />
     <WhyChooseUsSection/>
     <StatsSection/>
     <DesignProcessSection/>
     <ReviewSection reviews={reviews} />
     <ContactSection/>
     <FAQSection/>
     
    </div>
  )
}
